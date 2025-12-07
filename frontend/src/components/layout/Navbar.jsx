import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="w-full h-16 bg-white dark:bg-[#0b0b0b] border-b border-gray-300 dark:border-gray-800 flex items-center px-6 justify-between">

      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
        Expense Tracker
      </h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="text-xl text-gray-700 dark:text-gray-300"
      >
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>

    </div>
  );
}
