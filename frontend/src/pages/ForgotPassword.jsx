import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0F0F0F] border border-orange-500/20 rounded-3xl p-8 shadow-[0_0_60px_rgba(255,120,0,0.15)] animate-fade-in-up">
        <Link
          to="/login"
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {sent ? (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircle size={64} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Check your inbox
            </h2>
            <p className="text-gray-400">
              If an account exists for <b>{email}</b>, we sent a password reset
              link.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-400 mb-8">
              Enter your email address and we'll send you a link to reset it.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-gray-400">Email Address</label>
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-1">
                  <Mail size={18} className="text-orange-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-transparent outline-none w-full text-white"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold
                    bg-orange-500 text-black hover:bg-orange-400 transition shadow-lg shadow-orange-900/20"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
