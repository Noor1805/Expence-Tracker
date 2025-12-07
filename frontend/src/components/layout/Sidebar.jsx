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
      className={`h-full bg-[#080808] dark:bg-[#080808] border-r border-gray-900 
      transition-all duration-300 flex flex-col shadow-xl
      ${open ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        {open && (
          <h2 className="text-xl font-semibold text-white tracking-wide">
            My Finance
          </h2>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="text-gray-400 hover:text-white transition"
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
                  ? "text-white bg-[#111] shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-[#111] hover:shadow-lg hover:shadow-blue-500/10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 w-1 h-full rounded-r-xl bg-blue-500"></span>
                )}

                <span className="text-xl">{item.icon}</span>

                {open && <span className="transition-all">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <div
          className={`${open ? "px-4 py-3" : "p-3"} 
  rounded-xl 
  cursor-pointer 
  transition-all 
  duration-300 
  bg-[rgba(25,25,35,0.65)] 
  backdrop-blur-md 
  border border-[rgba(80,150,255,0.2)]
  shadow-[0_0_18px_rgba(80,150,255,0.25)]
  hover:shadow-[0_0_25px_rgba(80,150,255,0.45)]
  hover:-translate-y-1
  text-transparent bg-clip-text
  bg-gradient-to-r from-[#4aa8ff] via-[#6e7dff] to-[#8a5bff]
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
