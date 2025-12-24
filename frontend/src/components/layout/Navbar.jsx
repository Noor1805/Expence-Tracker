import { FiBell, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";
import api from "../../services/api";

export default function Navbar() {
  const { theme } = useContext(ThemeContext);
  const { notifications } = useNotification();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
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
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full
            bg-black/5 dark:bg-white/5
            hover:bg-black/10 dark:hover:bg-white/10 transition relative"
          >
            <FiBell className="text-gray-700 dark:text-gray-300" />
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-3 w-72 rounded-2xl
              bg-white dark:bg-[#0F0F0F]
              border border-gray-200 dark:border-white/10
              shadow-2xl p-4 z-50"
            >
              <h4 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-200">
                Notifications
              </h4>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className={`p-3 border-b border-gray-100 dark:border-white/5 last:border-0 
                      hover:bg-gray-50 dark:hover:bg-white/5 transition flex items-start gap-2
                      ${
                        !notif.isRead
                          ? "bg-orange-50/50 dark:bg-orange-500/10"
                          : ""
                      }`}
                    >
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            !notif.isRead
                              ? "font-semibold text-gray-900 dark:text-gray-100"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {notif.title && (
                            <span className="block mb-1 text-xs uppercase tracking-wider opacity-70">
                              {notif.title}
                            </span>
                          )}
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(
                            notif.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-9 h-9 rounded-full
            bg-gradient-to-br from-orange-400 to-orange-600
            flex items-center justify-center text-black font-semibold"
          >
            K
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
