import { useEffect, useState } from "react";
import api from "../../services/api";

const COLORS = [
  "#F472B6",
  "#22D3EE",
  "#FBBF24",
  "#A78BFA",
  "#34D399",
  "#FB7185",
];

const INITIAL_FORM = {
  name: "",
  type: "expense",
  color: COLORS[0],
  icon: "💰",
};

export default function CategoryForm({ editingCategory, onSuccess, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setForm(editingCategory);
    } else {
      setForm(INITIAL_FORM);
    }
  }, [editingCategory]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        type: form.type,
        color: form.color,
        icon: form.icon,
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, payload);
      } else {
        await api.post("/categories/create", payload);
      }
      onSuccess();
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#1a1a25] shadow-lg space-y-5"
    >
      <h3 className="font-semibold text-lg text-white mb-2">
        {editingCategory ? "Edit Category" : "Add New Category"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Groceries"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
            >
              <option value="expense" className="bg-[#1a1a25]">
                Expense
              </option>
              <option value="income" className="bg-[#1a1a25]">
                Income
              </option>
            </select>
          </div>

          <div className="w-24">
            <label className="text-xs text-gray-400 mb-1 block">Icon</label>
            <input
              name="icon"
              value={form.icon}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="🔥"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Color Tag</label>
          <div className="flex gap-3 flex-wrap">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                  form.color === c ? "ring-2 ring-white scale-110" : ""
                }`}
                style={{ background: c, boxShadow: `0 0 10px ${c}40` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving..." : editingCategory ? "Update" : "Create"}
        </button>

        {editingCategory && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
