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
      className="glass neo rounded-2xl p-6 border border-white/10"
    >
      <h2 className="text-lg font-semibold text-white mb-4">
        Set Monthly Budget
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          required
          placeholder="Category Name (e.g. Food)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="input"
          list="category-suggestions"
        />
        <datalist id="category-suggestions">
          {(categories || []).map((c) => (
            <option key={c._id} value={c.name} />
          ))}
        </datalist>

        <input
          type="number"
          required
          placeholder="Monthly Limit"
          value={form.limit}
          onChange={(e) => setForm({ ...form, limit: e.target.value })}
          className="input"
        />

        <button
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-400 text-black rounded-xl font-semibold transition-colors"
        >
          {loading ? "Saving..." : "Save Budget"}
        </button>
      </div>
    </form>
  );
}
