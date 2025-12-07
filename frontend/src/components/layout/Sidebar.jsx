import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiHome, FiList, FiPieChart, FiSettings } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Transactions", path: "/transactions", icon: <FiList /> },
    { name: "Categories", path: "/categories", icon: <BiCategoryAlt /> },
    { name: "Budgets", path: "/budgets", icon: <FiPieChart /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  return (
    <div
      className={`h-full bg-white dark:bg-[#0d0d0d] border-r border-gray-300 dark:border-gray-800 transition-all 
      ${open ? "w-64" : "w-20"} duration-300 flex flex-col`}
    >
      
      <div className="flex justify-end p-4">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-700 dark:text-gray-300"
        >
          {open ? "←" : "→"}
        </button>
      </div>

      
      <nav className="flex flex-col gap-2 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all 
              ${isActive
                ? "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {open && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
