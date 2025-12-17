import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiHome, FiList, FiPieChart, FiSettings } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/app", icon: <FiHome /> },
    { name: "Transactions", path: "/app/transactions", icon: <FiList /> },
    { name: "Categories", path: "/app/categories", icon: <BiCategoryAlt /> },
    { name: "Budgets", path: "/app/budgets", icon: <FiPieChart /> },
    { name: "Settings", path: "/app/settings", icon: <FiSettings /> },
  ];

  return (
    <div
      className={`h-full bg-[#080808] border-r border-gray-900 
      transition-all duration-300 flex flex-col shadow-xl
      ${open ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        {open && (
          <h2 className="text-xl font-semibold text-white tracking-wide">
            My <span className="text-orange-500">Finance</span>
          </h2>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="text-gray-400 hover:text-orange-500 transition"
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
                  ? "text-white bg-[#111] shadow-lg shadow-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-[#111] hover:shadow-md hover:shadow-orange-500/30"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 w-1 h-full rounded-r-xl bg-orange-500"></span>
                )}

                <span className="text-xl text-orange-500">
                  {item.icon}
                </span>

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
            bg-[rgba(25,25,35,0.65)]
            backdrop-blur-md
            border border-orange-500/80
            shadow-[0_0_18px_rgba(249,115,22,0.35)]
            hover:shadow-[0_0_28px_rgba(249,115,22,0.55)]
            hover:-translate-y-1
            text-transparent bg-clip-text
            bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
          `}
        >
          {open ? (
            <span className="font-semibold tracking-wide">
              Upgrade to Pro
            </span>
          ) : (
            <span className="text-xl">⭐</span>
          )}
        </div>
      </div>
    </div>
  );
}
