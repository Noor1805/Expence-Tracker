import { FiEdit2, FiTrash2, FiActivity } from "react-icons/fi";
import api from "../../services/api";
import { ICONS } from "./IconPicker";

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  onViewHistory,
}) {
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${category._id}`);
      onDelete();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(category.totalAmount || 0);

  const isIncome = category.type === "income";
  const iconObj = ICONS.find((i) => i.id === category.icon) || ICONS[0];

  // Helper to ensure we can append opacity correctly.
  const getBaseHex = (c) => {
    if (!c) return "#000000";
    if (c.length === 9) return c.substring(0, 7);
    return c;
  };

  const baseColor = getBaseHex(category.color);

  return (
    <div
      className="
        relative w-full max-w-[340px] mx-auto aspect-[4/5]
        rounded-[25px]
        p-6 flex flex-col items-center justify-between
        border border-white/10
        group cursor-pointer
        transition-all duration-500 hover:-translate-y-1
      "
      style={{
        background: `linear-gradient(165deg, ${baseColor}55 0%, #050505 60%, ${baseColor}22 100%)`,
        boxShadow: `0 15px 40px -10px ${baseColor}10`, // Subtle colored outer glow
        borderColor: `${baseColor}40`,
      }}
      onClick={() => onViewHistory(category)}
    >
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-white/20 backdrop-blur-md"
        >
          <FiEdit2 />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded-full bg-black/60 text-rose-400 hover:bg-rose-500/20 backdrop-blur-md"
        >
          <FiTrash2 />
        </button>
      </div>

      {/* 1. Icon Circle */}
      <div className="mt-4 relative">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white relative z-10"
          style={{
            background: baseColor,
            // Black shadows for "pop" effect as requested
            boxShadow:
              "0 10px 25px -5px rgba(0,0,0,0.8), 0 8px 10px -6px rgba(0,0,0,0.5)",
          }}
        >
          {iconObj.icon}
        </div>
        {/* Glow behind icon */}
        <div
          className="absolute inset-0 rounded-full blur-[30px] opacity-40 z-0"
          style={{ background: baseColor }}
        />
      </div>

      {/* 2. Name */}
      <h3 className="text-2xl audiowide-regular font-bold text-white tracking-wide mt-2">
        {category.name}
      </h3>

      {/* 3. Pills */}
      <div
        className="w-full bg-white/5 border rounded-full flex justify-between items-center px-2"
        style={{ borderColor: `${baseColor}40` }}
      >
        <span
          className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
          style={{
            color: isIncome ? "#23f06eff" : "#f30c2eff",
          }}
        >
          {category.type}
        </span>
        <span
          className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
          style={{ color: isIncome ? "#23f06eff" : "#f30c2eff" }}
        >
          {category.type}
        </span>
      </div>

      {/* 4. Bottom Stats Box - Centered & Refined */}
      <div className="w-full bg-white/5 rounded-2xl flex flex-col items-center justify-center p-5 border border-white/5 backdrop-blur-sm mt-2 relative overflow-hidden text-center">
        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">
          Total {isIncome ? "Earned" : "Spent"}:
        </p>
        <div className="text-3xl font-bold text-white tracking-tight mb-2">
          {formattedAmount}
        </div>

        <div className="w-full h-[1px] bg-white/10 mb-3"></div>

        {/* Heartbeat Line + Count */}
        <div
          className="flex items-center justify-center gap-2 text-sm font-medium"
          style={{ color: baseColor }}
        >
          <FiActivity className="text-3xl animate-pulse" />
          <span className="text-gray-300">
            {category.transactionCount || 0} Transactions
          </span>
        </div>
      </div>
    </div>
  );
}
