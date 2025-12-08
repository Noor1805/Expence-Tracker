import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 px-4">
      
      {/* CARD */}
      <div className="w-full max-w-md p-8 rounded-3xl 
          bg-[#0e0e0e] 
          shadow-[10px_10px_25px_rgba(0,0,0,0.6),_-10px_-10px_25px_rgba(40,40,40,0.2)]
          border border-white/5 backdrop-blur-xl
      ">

        {/* Title */}
        <h1 className="text-3xl font-semibold text-white text-center mb-6 
          bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/40 text-gray-200 
              border border-white/10 shadow-inner"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/40 text-gray-200 
              border border-white/10 shadow-inner"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white 
              bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 
              shadow-lg hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Already have account */}
        <p className="text-gray-400 text-center text-sm mt-5">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
