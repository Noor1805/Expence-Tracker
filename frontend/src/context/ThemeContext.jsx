import { createContext, useEffect, useState } from "react";
import api from "../services/api"; // Ensure api service is usable here

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark" // Default to dark for premium feel
  );

  // Allow explicit set or toggle
  const toggleTheme = (explicitTheme) => {
    if (explicitTheme) {
      setTheme(explicitTheme);
    } else {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }
  };

  // Sync with Backend (Optional: Can be done in AppLayout or here)
  useEffect(() => {
    const syncTheme = async () => {
      try {
        // Only fetch if logged in (token exists), but context might run before auth.
        // Simplified: We rely on Settings page to sync backend-to-frontend initially.
        // But we apply the CURRENT theme to DOM immediately.
      } catch (e) {
        // ignore
      }
    };
    syncTheme();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Context value includes helper to set explicit theme
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
