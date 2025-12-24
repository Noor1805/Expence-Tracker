import { FiUser, FiLogOut, FiSettings, FiHome } from "react-icons/fi";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div
      className="w-full h-16 flex items-center justify-between px-6
      bg-white dark:bg-[#0B0B0B]
      border-b border-gray-200 dark:border-white/10
      backdrop-blur-xl z-50"
    >
      <h1
        className="text-xl font-semibold text-gray-900 dark:text-gray-200 audiowide-regular cursor-pointer"
        onClick={() => navigate("/app")}
      >
        Mon<span className="text-orange-500">exa</span>
      </h1>

      <div className="flex items-center gap-4 relative">
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-9 h-9 rounded-full
            bg-gradient-to-br from-orange-400 to-orange-600
            flex items-center justify-center text-black font-semibold uppercase"
          >
            {user?.name?.charAt(0) || "U"}
          </button>

          {showProfile && (
            <div
              className="absolute right-0 mt-3 w-52 rounded-2xl
              bg-white dark:bg-[#0F0F0F]
              border border-gray-200 dark:border-white/10
              shadow-2xl overflow-hidden z-50"
            >
              <button
                onClick={() => {
                  navigate("/app/profile");
                  setShowProfile(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3
                hover:bg-black/5 dark:hover:bg-white/5 text-sm dark:text-gray-200"
              >
                <FiUser /> Profile
              </button>

              <button
                onClick={() => {
                  navigate("/");
                  setShowProfile(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3
                hover:bg-black/5 dark:hover:bg-white/5 text-sm dark:text-gray-200"
              >
                <FiHome /> Home Website
              </button>

              <button
                onClick={() => {
                  navigate("/app/settings");
                  setShowProfile(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3
                hover:bg-black/5 dark:hover:bg-white/5 text-sm dark:text-gray-200"
              >
                <FiSettings /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3
                hover:bg-red-500/10 text-sm text-red-500"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
