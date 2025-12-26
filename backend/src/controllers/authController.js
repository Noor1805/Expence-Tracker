import * as userService from "../services/userService.js";

// REGISTER
export async function register(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await userService.registerUser(
      req.body
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    next(error);
  }
}

// LOGIN
export async function login(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await userService.loginUser(
      req.body
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          currency: user.currency,
        },
        accessToken,
      },
    });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    next(error);
  }
}

// DEMO LOGIN
export async function demoLogin(req, res, next) {
  try {
    const demoEmail = "demo@example.com";
    const demoPassword = "demoPassword123";

    // Check if demo user exists
    let user = await userService.getUserByEmail(demoEmail);

    if (!user) {
      // Create demo user if not exists
      const registration = await userService.registerUser({
        name: "Demo User",
        email: demoEmail,
        password: demoPassword,
      });
      user = registration.user;
    }

    // Login logic re-used or called directly
    const { accessToken, refreshToken } = await userService.loginUser({
      email: demoEmail,
      password: demoPassword,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          currency: user.currency,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// LOGOUT
export async function logout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    await userService.logoutUser(token);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

// LOGOUT ALL DEVICES
export async function logoutAll(req, res, next) {
  try {
    await userService.logoutAllDevices(req.user.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ success: true, message: "Logged out from all devices" });
  } catch (err) {
    next(err);
  }
}

// REFRESH TOKEN
export async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    const { accessToken } = await userService.refreshUserToken(token);
    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    if (
      err.message === "No refresh token" ||
      err.message === "Invalid refresh token" ||
      err.message === "User not found"
    ) {
      return res.status(401).json({ success: false, message: err.message });
    }
    next(err);
  }
}

// GET ME
export async function getMe(req, res, next) {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    next(err);
  }
}

// DELETE ACCOUNT
export async function deleteAccount(req, res, next) {
  try {
    await userService.deleteUserAccount(req.user.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
}
