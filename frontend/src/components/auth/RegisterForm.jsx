import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Mail, Lock, User } from "lucide-react";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/app");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0F0F0F] border border-orange-500/20 rounded-3xl p-8 shadow-[0_0_60px_rgba(255,120,0,0.15)]">
      <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
      <p className="text-gray-400 mb-8">
        Join us to start tracking your finances
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm text-gray-400">Full Name</label>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-1 has-[:focus]:border-orange-500/50 transition-colors">
            <User size={18} className="text-orange-500" />
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="bg-transparent outline-none w-full text-white placeholder-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Email</label>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-1 has-[:focus]:border-orange-500/50 transition-colors">
            <Mail size={18} className="text-orange-500" />
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="bg-transparent outline-none w-full text-white placeholder-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Password</label>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-1 has-[:focus]:border-orange-500/50 transition-colors">
            <Lock size={18} className="text-orange-500" />
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-transparent outline-none w-full text-white placeholder-gray-600"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold
            bg-orange-500 text-black hover:bg-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-gray-400 text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-orange-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
