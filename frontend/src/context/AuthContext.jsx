import { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success) {
        setUser(res.data);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      localStorage.setItem("token", res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return res.data.user;
    }
  };

  const loginDemo = async () => {
    const res = await authService.demoLogin();
    if (res.success) {
      localStorage.setItem("token", res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return res.data.user;
    }
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success) {
      localStorage.setItem("token", res.accessToken);
      // After register usually we want to fetch user profile or if API returns user object we use it.
      // Assuming for now we verify auth or auto login.
      await checkAuth();
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        loginDemo,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
