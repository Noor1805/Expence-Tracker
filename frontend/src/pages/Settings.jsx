import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { FiBell, FiShield, FiTrash2, FiUser, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [settings, setSettings] = useState({
    theme: theme,
    currency: "INR",
    notifications: true,
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  // FETCH SETTINGS
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/settings");
      if (res.data.data) {
        const data = res.data.data;
        setSettings((prev) => ({
          ...prev,
          ...data,
          theme: data.theme || theme,
          notifications: data.notificationsEnabled ?? prev.notifications,
        }));
      }
    } catch (err) {
      console.error("Settings fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // SAVE SETTINGS
  const saveSettings = async (updated) => {
    // Optimistic UI update
    setSettings(updated);

    try {
      await api.put("/settings", {
        ...updated,
        notificationsEnabled: updated.notifications,
      });
    } catch {
      alert("Failed to save settings");
    }
  };

  // ACTIONS
  const logoutAll = async () => {
    if (!confirm("Are you sure you want to logout from ALL devices?")) return;
    try {
      await api.post("/auth/logout-all");
      window.location.href = "/login";
    } catch (e) {
      alert("Logout failed");
    }
  };

  const deleteAccount = async () => {
    const confirmation = prompt(
      "Type 'DELETE' to confirm permanent account deletion:"
    );
    if (confirmation !== "DELETE") return;

    try {
      await api.delete("/auth/delete-account");
      window.location.href = "/signup";
    } catch (e) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Loading settings...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl pb-20"
    >
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Settings
        </h1>
      </div>

      {/* PROFILE */}
      <section className="glass neo rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-orange-500/20 transition-all duration-700"></div>

        <h2 className="text-xl text-white font-semibold mb-6 flex items-center gap-3">
          <FiUser className="text-orange-400" /> User Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Full Name</label>
            <input
              className="input bg-black/20 border-white/10 text-gray-300 cursor-not-allowed"
              value={settings.name || "User"}
              disabled
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Email Address</label>
            <input
              className="input bg-black/20 border-white/10 text-gray-300 cursor-not-allowed"
              value={settings.email || ""}
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-orange-400/80 bg-orange-500/5 p-3 rounded-xl border border-orange-500/10">
          <FiInfo />
          <span>
            Profile details are managed via your account provider. Contact
            support to update.
          </span>
        </div>
      </section>

      {/* APPEARANCE & PREFERENCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Currency */}
        <section className="glass neo rounded-3xl p-8 border border-white/5">
          <h2 className="text-xl text-white font-semibold mb-6 flex items-center gap-3">
            Currency
          </h2>

          <div className="relative">
            <select
              value={settings.currency || "INR"}
              onChange={(e) =>
                saveSettings({ ...settings, currency: e.target.value })
              }
              className="w-full appearance-none bg-[#0a0a0f] text-white px-6 py-4 rounded-2xl border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all cursor-pointer text-lg"
            >
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
              <option value="GBP">£ GBP (British Pound)</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              ▼
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4 pl-1">
            Updates currency symbol across all dashboards.
          </p>
        </section>
      </div>

      {/* NOTIFICATIONS */}
      <section className="glass neo rounded-3xl p-8 border border-white/5">
        <h2 className="text-xl text-white font-semibold mb-6 flex items-center gap-3">
          <FiBell className="text-teal-400" /> Notifications
        </h2>

        <div
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() =>
            saveSettings({
              ...settings,
              notifications: !settings.notifications,
            })
          }
        >
          <div>
            <p className="text-white font-medium text-lg">Push Notifications</p>
            <p className="text-gray-400 text-sm">
              Receive alerts about budget limits and monthly reports
            </p>
          </div>

          <div
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
              settings.notifications ? "bg-teal-500" : "bg-gray-700"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                settings.notifications ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </section>

      {/*SECURITY & DANGER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass neo rounded-3xl p-8 border border-white/5">
          <h2 className="text-xl text-white font-semibold mb-6 flex items-center gap-3">
            <FiShield className="text-purple-400" /> Security
          </h2>
          <button
            onClick={logoutAll}
            className="w-full py-4 rounded-2xl bg-white/5 hover:bg-purple-500/10 hover:text-purple-400 border border-white/10 text-gray-300 font-medium transition-all"
          >
            Logout from all devices
          </button>
        </section>

        <section className="glass neo rounded-3xl p-8 border border-red-500/20 bg-red-500/5">
          <h2 className="text-xl text-red-400 font-semibold mb-6 flex items-center gap-3">
            <FiTrash2 /> Danger Zone
          </h2>
          <button
            onClick={deleteAccount}
            className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 font-medium transition-all"
          >
            Delete Account
          </button>
        </section>
      </div>
    </motion.div>
  );
}
