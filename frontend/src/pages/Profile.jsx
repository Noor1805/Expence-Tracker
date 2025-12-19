import { useEffect, useState } from "react";
import api from "../services/api";
import { User, Mail, Calendar, Shield, MapPin } from "lucide-react";
import moment from "moment";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-white">Loading Profile...</div>;
  if (!user)
    return <div className="p-10 text-red-500">Failed to load profile.</div>;

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">My Profile</h1>

      {/* Profile Header */}
      <div className="glass neo p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-4xl font-bold text-black shadow-2xl relative z-10">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="text-center md:text-left z-10">
          <h2 className="text-3xl font-bold text-white">{user.name}</h2>
          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mt-2">
            <Mail size={16} /> {user.email}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm border border-orange-500/20">
            <Shield size={14} />{" "}
            {user.role === "admin" ? "Administrator" : "Standard User"}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass neo p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User size={20} className="text-blue-400" /> Account Details
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg text-gray-200">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="text-lg text-gray-200">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="glass neo p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-green-400" /> Activity
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-lg text-gray-200">
                {moment(user.createdAt).format("MMMM Do, YYYY")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="text-lg text-gray-200">Just Now</p>
            </div>
          </div>
        </div>

        <div className="glass neo p-6 rounded-2xl border border-white/5 md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-purple-400" /> Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
            <p>
              Base Currency:{" "}
              <span className="text-white font-medium">
                {user.currency || "INR"}
              </span>
            </p>
            <p>
              Timezone:{" "}
              <span className="text-white font-medium">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
