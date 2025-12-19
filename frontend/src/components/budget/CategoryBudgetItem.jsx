import { motion } from "framer-motion";
import api from "../../services/api";
import { Trash2 } from "lucide-react";
import BudgetProgress from "./BudgetProgressBar";

export default function CategoryBudgetItem({ budget, onChange }) {
  const { category, limit, spent } = budget;

  const remove = async () => {
    if (!confirm("Delete this budget?")) return;
    try {
      await api.delete(`/budget/delete/${budget._id}`);
      onChange();
    } catch {
      alert("Failed to delete budget");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass neo relative p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group"
    >
      <button
        onClick={remove}
        className="absolute top-4 right-4 p-2 rounded-full text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 size={16} />
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg">
          {category?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg tracking-wide">
            {category?.name}
          </h3>
          <p className="text-xs text-gray-400">Monthly Budget</p>
        </div>
      </div>

      <BudgetProgress used={spent} limit={limit} />

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
        <p className="text-xs text-gray-500">Remaining</p>
        <p
          className={`text-sm font-bold ${
            limit - spent < 0 ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {limit - spent < 0 ? "-" : ""}₹
          {Math.abs(limit - spent).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
