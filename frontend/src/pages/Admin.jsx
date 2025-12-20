import { useEffect, useState } from "react";
import api from "../services/api";
import { ShieldAlert } from "lucide-react";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  if (loading) return <div className="p-10 text-white">Checking Access...</div>;

  if (!user || user.role !== "admin") {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <ShieldAlert size={80} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 max-w-md">
          You do not have the necessary permissions to view this page. This area
          is restricted to administrators only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      <p className="text-gray-400">Welcome, Administrator.</p>

      <div className="p-10 border border-dashed border-gray-700 rounded-2xl text-center text-gray-500">
        Admin features (User Management, Global Settings) coming soon.
      </div>
    </div>
  );
}
