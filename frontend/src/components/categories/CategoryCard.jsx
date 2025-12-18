import { FiEdit2, FiTrash2, FiActivity } from "react-icons/fi";
import api from "../../services/api";

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  onViewHistory,
}) {
  const handleDelete = async () => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${category._id}`);
      onDelete();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(category.totalAmount || 0);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
      style={{
        boxShadow: `0 4px 20px -10px ${category.color}40`,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${category.color}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4 items-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`,
                color: "white",
                boxShadow: `0 0 15px ${category.color}30`,
              }}
            >
              {category.icon}
            </div>
            <div>
              <h4 className="font-bold text-white text-lg tracking-wide">
                {category.name}
              </h4>
              <span
                className={`text-xs px-2 py-1 rounded-full border inline-block mt-1 ${
                  category.type === "income"
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                    : "border-rose-500/30 text-rose-400 bg-rose-500/10"
                }`}
              >
                {category.type.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={() => onEdit(category)}
              className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5 mt-2">
          <div className="bg-white/5 rounded-xl py-3 px-1">
            <p className="text-xs text-gray-400 mb-1">
              Total {category.type === "expense" ? "Spent" : "Earned"}
            </p>
            <p className="font-mono text-white text-lg font-semibold tracking-tight">
              {formattedAmount}
            </p>
          </div>
          <button
            onClick={() => onViewHistory(category)}
            className="bg-white/5 rounded-xl p-3 flex flex-col justify-center hover:bg-white/10 transition-colors text-left group-hover/stats"
          >
            <p className="text-xs text-gray-400 mb-1 group-hover/stats:text-blue-300 transition-colors">
              Transactions ↗
            </p>
            <div className="flex items-center gap-2">
              <FiActivity className="text-gray-500 group-hover/stats:text-blue-400 transition-colors" />
              <p className="font-mono text-white text-lg font-semibold">
                {category.transactionCount || 0}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
