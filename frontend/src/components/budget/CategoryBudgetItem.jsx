import { motion } from "framer-motion";
import api from "../../services/api";
import { FiTrash2, FiTarget } from "react-icons/fi";
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
      className="
        relative p-6 rounded-[30px] 
        bg-[#111] border border-white/5 
        hover:border-cyan-500/30 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] 
        transition-all duration-300 group
      "
    >
      <button
        onClick={remove}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-20"
      >
        <FiTrash2 size={16} />
      </button>

      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 flex items-center justify-center text-cyan-400 text-xl font-bold shadow-inner">
          {category?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h3 className="text-white font-bold text-lg tracking-wide leading-none mb-1">
            {category?.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
            <FiTarget className="text-cyan-500/50" />
            <span>Target: ₹{limit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <BudgetProgress used={spent} limit={limit} />

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-white/5">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Remaining
        </p>
        <p
          className={`text-sm font-bold font-mono tracking-tight ${
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
