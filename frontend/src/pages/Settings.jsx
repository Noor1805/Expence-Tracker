import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import {
  FiBell,
  FiShield,
  FiTrash2,
  FiUser,
  FiInfo,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function Settings() {
  const { theme } = useContext(ThemeContext);

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
      <div className="min-h-screen flex items-center justify-center bg-[#05080d]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05080d] p-4 md:p-8 lg:p-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl space-y-8 md:space-y-10"
      >
        <div className="text-center pt-4 md:pt-0">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-widest audiowide-regular mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            SETTINGS
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Manage your preferences and account
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6 md:space-y-8">
            <section className="relative overflow-hidden p-6 md:p-8 rounded-[30px] border border-white/10 bg-[#111] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-xl text-cyan-400 shrink-0">
                  <FiUser />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white audiowide-regular tracking-wide">
                    Profile
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    Your account details
                  </p>
                </div>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 tracking-widest uppercase ml-2">
                    Display Name
                  </label>
                  <div className="w-full px-5 py-3 md:px-6 md:py-4 rounded-2xl bg-[#1a1a1a] border border-white/5 text-gray-300 font-medium truncate">
                    {settings.name || "User"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 tracking-widest uppercase ml-2">
                    Email Address
                  </label>
                  <div className="w-full px-5 py-3 md:px-6 md:py-4 rounded-2xl bg-[#1a1a1a] border border-white/5 text-gray-300 font-medium opacity-75 truncate">
                    {settings.email || "No email"}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 text-cyan-400/80 text-xs md:text-sm mt-2">
                  <FiInfo className="mt-0.5 text-base shrink-0" />
                  <p>
                    Profile information is managed by your authentication
                    provider defined during signup.
                  </p>
                </div>
              </div>
            </section>

            <section className="p-6 md:p-8 rounded-[30px] border border-white/10 bg-[#111] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-xl text-emerald-400 shrink-0">
                  <FiCreditCard />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white audiowide-regular tracking-wide">
                    Currency
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    Global display currency
                  </p>
                </div>
              </div>

              <div className="relative group">
                <select
                  value={settings.currency || "INR"}
                  onChange={(e) =>
                    saveSettings({ ...settings, currency: e.target.value })
                  }
                  className="w-full appearance-none bg-[#1a1a1a] text-white px-5 py-4 pr-12 rounded-2xl border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all cursor-pointer text-sm md:text-lg font-medium tracking-wide"
                >
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                  <option value="GBP">£ GBP (British Pound)</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-emerald-400 transition-colors">
                  ▼
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6 md:space-y-8">
            <section className="p-6 md:p-8 rounded-[30px] border border-red-500/20 bg-gradient-to-b from-red-900/10 to-transparent shadow-[0_10px_40px_-10px_rgba(255,0,0,0.1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-xl text-red-500 shrink-0">
                  <FiShield />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white audiowide-regular tracking-wide">
                    Security
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    Critical account actions
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={logoutAll}
                  className="w-full py-4 rounded-2xl bg-[#1a1a1a] hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white font-bold tracking-wide transition-all flex items-center justify-center gap-3 group text-sm md:text-base"
                >
                  <FiLogOut className="group-hover:-translate-x-1 transition-transform" />
                  Log Out All Devices
                </button>

                <button
                  onClick={deleteAccount}
                  className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 font-bold tracking-wide transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <FiTrash2 />
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
