import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiList,
  FiPieChart,
  FiSettings,
  FiShield,
} from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";
import useAuth from "../../hooks/useAuth";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { user } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/app", icon: <FiHome /> },
    { name: "Transactions", path: "/app/transactions", icon: <FiList /> },
    { name: "Categories", path: "/app/categories", icon: <BiCategoryAlt /> },
    { name: "Budgets", path: "/app/budgets", icon: <FiPieChart /> },
    { name: "Settings", path: "/app/settings", icon: <FiSettings /> },
  ];

  if (user?.role === "admin") {
    menuItems.push({ name: "Admin", path: "/app/admin", icon: <FiShield /> });
  }

  return (
    <div
      className={`h-full bg-white dark:bg-[#080808] border-r border-gray-200 dark:border-gray-900 
      transition-all duration-300 flex flex-col shadow-xl z-50
      ${open ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        {open && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">
            My <span className="text-orange-500">Finance</span>
          </h2>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition"
        >
          {open ? "←" : "→"}
        </button>
      </div>

      <nav className="flex flex-col mt-4 gap-2 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-3 rounded-xl 
              text-sm font-medium transition-all group
              ${
                isActive
                  ? "text-white bg-black dark:text-white dark:bg-[#111] shadow-lg shadow-orange-500/10 dark:shadow-orange-500/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#111]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 w-1 h-full rounded-r-xl bg-orange-500"></span>
                )}

                <span className="text-xl text-orange-500">{item.icon}</span>

                {open && <span className="transition-all">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <div
          className={`${open ? "px-4 py-3" : "p-3"} 
            rounded-xl cursor-pointer
            transition-all duration-300
            bg-gradient-to-br from-orange-50 to-white
            dark:bg-[rgba(25,25,35,0.65)]
            dark:backdrop-blur-md
            border border-orange-200 dark:border-orange-500/80
            shadow-sm dark:shadow-[0_0_18px_rgba(249,115,22,0.35)]
            hover:shadow-md dark:hover:shadow-[0_0_28px_rgba(249,115,22,0.55)]
            hover:-translate-y-1
            text-gray-900 dark:text-transparent dark:bg-clip-text
            dark:bg-gradient-to-r dark:from-orange-400 dark:via-orange-500 dark:to-orange-600
          `}
        >
          {open ? (
            <span className="font-semibold tracking-wide">Upgrade to Pro</span>
          ) : (
            <span className="text-xl">⭐</span>
          )}
        </div>
      </div>
    </div>
  );
}
