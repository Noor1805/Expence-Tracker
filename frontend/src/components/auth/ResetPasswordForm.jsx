import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import authService from "../../services/authService";
import { Lock, ArrowLeft } from "lucide-react";

export default function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(token, password);
      // Wait a bit then redirect
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0F0F0F] border border-orange-500/20 rounded-3xl p-8 shadow-[0_0_60px_rgba(255,120,0,0.15)]">
      {success ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Password Reset!
          </h1>
          <p className="text-gray-400 mb-6">
            Your password has been successfully reset.
          </p>
          <p className="text-orange-500">Redirecting to login...</p>
          <Link to="/login" className="block mt-6 text-white hover:underline">
            Click here if not redirected
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 mb-8">Enter your new password below.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-400">New Password</label>
              <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-1 has-[:focus]:border-orange-500/50 transition-colors">
                <Lock size={18} className="text-orange-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400">Confirm Password</label>
              <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-1 has-[:focus]:border-orange-500/50 transition-colors">
                <Lock size={18} className="text-orange-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
