import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import { Lock, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      alert(
        err.response?.data?.message || "Reset failed. Link might be expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0F0F0F] border border-orange-500/20 rounded-3xl p-8 shadow-[0_0_60px_rgba(255,120,0,0.15)]">
        {success ? (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircle size={64} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Password Reset!
            </h2>
            <p className="text-gray-400 mb-6">
              Your password has been successfully updated.
            </p>
            <Link
              to="/login"
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">New Password</h1>
            <p className="text-gray-400 mb-8">
              Create a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-gray-400">New Password</label>
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-1">
                  <Lock size={18} className="text-orange-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="bg-transparent outline-none w-full text-white"
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Confirm Password
                </label>
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-1">
                  <Lock size={18} className="text-orange-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="bg-transparent outline-none w-full text-white"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold
                    bg-orange-500 text-black hover:bg-orange-400 transition shadow-lg shadow-orange-900/20"
              >
                {loading ? "Resetting..." : "Set New Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
