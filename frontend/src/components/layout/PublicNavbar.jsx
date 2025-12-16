import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "Home", id: "home" }, // Ensure Home has id="home"
    { label: "Features", id: "features" },
    { label: "Pricing", id: "pricing" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-orange-500/20 shadow-[0_0_15px_rgba(255,120,0,0.3)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        <Link
          to="/"
          className="text-2xl audiowide-regular font-bold tracking-wide text-white"
        >
          Mon
          <span className="text-orange-500 drop-shadow-[0_0_1px_orange]">
            exa
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-10 text-gray-300 text-sm">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.id)}
              className="relative group bg-transparent border-none cursor-pointer"
            >
              <span className="text-gray-300 group-hover:text-white transition">
                {item.label}
              </span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-500 shadow-[0_0_8px_orange] transition-all group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg text-sm text-gray-200 border border-orange-500/30 
            bg-black/40 backdrop-blur-md 
            hover:bg-black/60 
            transition-all duration-300 
            shadow-[inset_0_0_10px_rgba(255,120,0,0.25)]"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white 
            bg-gradient-to-r from-orange-500 to-orange-600 
            shadow-[0_0_3px_rgb(255,120,0),0_0_5px_rgba(255,120,0,0.6)]
            transition-all duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-6 bg-black/70 backdrop-blur-xl border-t border-orange-500/20">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.id)}
              className="text-left text-gray-300 text-lg hover:text-white transition relative group bg-transparent border-none"
            >
              {item.label}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-500 shadow-[0_0_8px_orange] transition-all group-hover:w-full"></span>
            </button>
          ))}

          <div className="flex flex-col gap-4">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="px-5 py-3 rounded-lg text-center text-sm 
              text-gray-200 border border-orange-500/30 bg-black/40 backdrop-blur-md 
              shadow-[inset_0_0_10px_rgba(255,120,0,0.25)]"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="px-5 py-3 rounded-lg text-center text-sm font-semibold text-white
              bg-gradient-to-r from-orange-500 to-orange-600
              shadow-[0_0_0px_rgba(255,120,0,0.4)]
              hover:shadow-[0_0_3px_rgba(255,120,0,0.55)]
              transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
