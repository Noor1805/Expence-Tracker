import { useEffect, useState } from "react";
import api from "../../services/api";
import IconPicker, { ICONS } from "./IconPicker";
import { FiCheck } from "react-icons/fi";

const COLORS = [
  "#ca1472ff", // pink
  "#0ed8f7ff", // cyan
  "#f5c814ff", // yellow
  "#542dcbff", // purple
  "#0ac24dff", // green
  "#e91434ff", // red
];

export default function CategoryForm({ editingCategory, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    type: "expense",
    icon: "cart",
    color: COLORS[0],
  });

  useEffect(() => {
    if (editingCategory) {
      setForm(editingCategory);
    } else {
      setForm({ name: "", type: "expense", icon: "cart", color: COLORS[0] });
    }
  }, [editingCategory]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      type: form.type,
      icon: form.icon,
      color: form.color,
    };
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, payload);
      } else {
        await api.post("/categories/create", payload);
      }
      setForm({ name: "", type: "expense", icon: "cart", color: COLORS[0] });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to save");
    }
  };

  const currentIconObj = ICONS.find((i) => i.id === form.icon) || ICONS[0];

  return (
    <form
      onSubmit={submit}
      className="
        p-5 sm:p-6 rounded-[35px]
        bg-[#111] 
        border border-cyan-500/30
        shadow-[0_0_40px_rgba(6,182,212,0.15)]
        relative overflow-hidden
      "
    >
      <h3 className="text-white text-2xl text-center audiowide-regular font-bold mb-8 tracking-wide relative z-10">
        {editingCategory ? "Edit Category" : "Add New Category"}
      </h3>

      <div className="space-y-8 relative z-10">
        {/* Name */}
        <div className="space-y-3">
          <label className="text-gray-400 text-sm ml-2 py-2.5 font-medium tracking-wide">
            NAME
          </label>
          <input
            placeholder="Enter category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
            required
          />
        </div>

        {/* Type */}
        <div className="space-y-3">
          <label className="text-gray-400 text-sm ml-2 py-2.5 font-medium tracking-wide">
            TYPE
          </label>
          <div className="relative">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-[#1a1a1a] border border-white/10 text-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none appearance-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              ▼
            </div>
          </div>
        </div>

        {/* Icon */}
        <div className="space-y-3">
          <label className="text-gray-400 text-sm ml-7 font-medium tracking-wide">
            ICON
          </label>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="w-24 h-24 rounded-3xl mt-1 flex items-center justify-center text-4xl text-cyan-300 bg-cyan-500/10 border-2 border-cyan-500/50 shadow-[0_0_5px_rgba(6,182,212,0.4)] shrink-0 mx-auto sm:mx-0 transition-transform hover:scale-105">
              {currentIconObj.icon}
            </div>
            <div className="py-3 px-1 bg-[#1a1a1a] rounded-3xl border border-white/5 flex-1">
              <IconPicker
                value={form.icon}
                onChange={(icon) => setForm({ ...form, icon })}
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <label className="text-gray-400 text-sm ml-1 font-medium tracking-wide">
            COLOR TAGS
          </label>
          <div className="flex flex-wrap gap-4 pt-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, color: c })}
                className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center ${
                  form.color === c
                    ? "scale-110 ring-4 ring-white/20 shadow-[0_0_20px_" +
                      c +
                      "]"
                    : "hover:scale-110 opacity-70 hover:opacity-100"
                }`}
                style={{ background: c }}
              >
                {form.color === c && (
                  <FiCheck className="text-black/60 text-xl font-bold" />
                )}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full py-5 text-white font-bold text-xl rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all mt-4">
          {editingCategory ? "Update Category" : "Create New Category"}
        </button>

        {editingCategory && (
          <button
            onClick={() => onSuccess()}
            type="button"
            className="w-full py-3 text-gray-500 hover:text-white transition-colors"
          >
            Cancel Editing
          </button>
        )}
      </div>
    </form>
  );
}
