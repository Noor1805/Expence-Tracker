import Settings from "../models/Settings.js";


export const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    let settings = await Settings.findOne({ user: userId }).populate(
      "user",
      "name email"
    );

    if (!settings) {
      settings = await Settings.create({ user: userId });
      settings = await Settings.findOne({ user: userId }).populate(
        "user",
        "name email"
      );
    }

    const responseData = {
      ...settings.toObject(),
      name: settings.user?.name || "User",
      email: settings.user?.email || "",
    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currency, theme, notificationsEnabled } = req.body;

    let settings = await Settings.findOne({ user: userId });

    if (!settings) {
      settings = await Settings.create({ user: userId });
    }

    if (currency) settings.currency = currency;
    if (theme) settings.theme = theme;
    if (notificationsEnabled !== undefined) {
      settings.notificationsEnabled = notificationsEnabled;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: {
        ...settings.toObject(),
      },
    });
  } catch (error) {
    console.error("Update Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
