import { useState } from "react";
import api from "../../services/api";

export default function BudgetForm({ categories, onSuccess }) {
  const [form, setForm] = useState({
    category: "",
    limit: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/budget/set-category", form);
      setForm({ category: "", limit: "" });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="
        p-8 rounded-[35px]
        bg-[#111] 
        border border-cyan-500/30
        shadow-[0_0_40px_rgba(6,182,212,0.15)]
        relative overflow-hidden
      "
    >
      <h3 className="text-white text-2xl font-bold mb-8 tracking-wide relative z-10 text-center audiowide-regular">
        Set Monthly Budget
      </h3>

      <div className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="text-gray-400 text-xs font-bold tracking-widest ml-1 uppercase">
            Category
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Food"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
              list="category-suggestions"
            />
            <datalist id="category-suggestions">
              {(categories || []).map((c) => (
                <option key={c._id} value={c.name} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-gray-400 text-xs font-bold tracking-widest ml-1 uppercase">
            Monthly Limit
          </label>
          <input
            type="number"
            required
            placeholder="₹ 5000"
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-5 text-white font-bold text-xl rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Budget"}
        </button>
      </div>
    </form>
  );
}
