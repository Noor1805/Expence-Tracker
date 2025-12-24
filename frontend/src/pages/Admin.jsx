import { useEffect, useState } from "react";
import api from "../services/api";
import adminService from "../services/adminService";
import {
  ShieldAlert,
  Users,
  DollarSign,
  Activity,
  Trash2,
  Ban,
  CheckCircle,
  Search,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
      ]);
      setStats(statsRes.stats);
      setUsers(usersRes.users);
    } catch (err) {
      console.error(err);
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleBlock = async (id, isBlocked) => {
    if (
      !window.confirm(
        `Are you sure you want to ${isBlocked ? "unblock" : "block"} this user?`
      )
    )
      return;

    try {
      await adminService.toggleBlockUser(id);
      fetchData(); // Refresh data
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to PERMANENTLY delete this user? This cannot be undone."
      )
    )
      return;

    try {
      await adminService.deleteUser(id);
      fetchData();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <div className="p-10 text-red-500">{error}</div>;

  // Chart Data Preparation
  const userStatusData = [
    { name: "Active", value: stats?.activeUsers || 0 },
    { name: "Blocked", value: stats?.blockedUsers || 0 },
  ];
  const COLORS = ["#10B981", "#EF4444"];

  const financialData = [
    { name: "Income", amount: stats?.totalIncome || 0 },
    { name: "Expense", amount: stats?.totalExpense || 0 },
  ];

  // Filter Users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide audiowide-regular">
          Admin <span className="text-cyan-500">Dashboard</span>
        </h1>
        <p className="text-gray-400 mt-2">System Overview & User Management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users size={24} />}
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          icon={<Activity size={24} />}
          label="Transactions"
          value={stats?.totalTransactions || 0}
          color="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          icon={<DollarSign size={24} />}
          label="Total Income"
          value={`₹${stats?.totalIncome?.toLocaleString()}`}
          color="bg-green-500/10 text-green-500"
        />
        <StatCard
          icon={<DollarSign size={24} />}
          label="Total Expense"
          value={`₹${stats?.totalExpense?.toLocaleString()}`}
          color="bg-red-500/10 text-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            User Status Distribution
          </h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={userStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#222",
                    borderColor: "#444",
                    color: "#fff",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Financial Overview
          </h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#222",
                    borderColor: "#444",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="amount" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-white">User Management</h2>
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {u.name}
                          </p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          u.role === "admin"
                            ? "bg-purple-500/10 text-purple-500"
                            : "bg-gray-700/30 text-gray-400"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isBlocked ? (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                          <Ban size={14} /> BLOCKED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-500 text-xs font-bold">
                          <CheckCircle size={14} /> ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {u.role !== "admin" && (
                        <>
                          <button
                            onClick={() =>
                              handleToggleBlock(u._id, u.isBlocked)
                            }
                            className={`p-2 rounded-lg transition ${
                              u.isBlocked
                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                            }`}
                            title={u.isBlocked ? "Unblock User" : "Block User"}
                          >
                            {u.isBlocked ? (
                              <CheckCircle size={18} />
                            ) : (
                              <Ban size={18} />
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
