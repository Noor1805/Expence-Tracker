import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const theme = "dark";

  const toggleTheme = () => {};

  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
