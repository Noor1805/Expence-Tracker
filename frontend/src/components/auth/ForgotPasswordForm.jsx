import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0F0F0F] border border-orange-500/20 rounded-3xl p-8 shadow-[0_0_60px_rgba(255,120,0,0.15)]">
      <Link
        to="/login"
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Login
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
      <p className="text-gray-400 mb-8">
        Enter your email to receive reset instructions
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-4 rounded-lg text-center">
          <p>Check your email for password reset instructions.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-1 has-[:focus]:border-orange-500/50 transition-colors">
              <Mail size={18} className="text-orange-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-transparent outline-none w-full text-white placeholder-gray-600"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold
                bg-orange-500 text-black hover:bg-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
}
