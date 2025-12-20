
import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function TransactionCard({ item, onEdit, onDelete }) {
  const isIncome = item.type === "income";
  const amountClass = isIncome ? "text-emerald-400" : "text-red-400";

 
  const bgGradient = isIncome
    ? "from-emerald-500/20 to-teal-500/20 text-emerald-400"
    : "from-red-500/20 to-pink-500/20 text-red-400";

  return (
    <div className="group relative p-2.5 md:p-4 rounded-[18px] md:rounded-[25px] bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222] transition-all duration-300">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        
        <div className="flex items-center gap-2.5 md:gap-4 flex-1 min-w-0">
          <div
            className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${bgGradient} flex items-center justify-center text-base md:text-xl font-bold shadow-inner shrink-0`}
          >
            {item.category?.charAt(0)?.toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-white font-bold text-sm md:text-base truncate leading-tight">
                {item.category}
              </h3>
            </div>

            
            <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 overflow-hidden">
              <span className="px-1 py-0.5 rounded bg-white/5 uppercase tracking-wider text-gray-400 border border-white/5 whitespace-nowrap">
                {item.paymentMethod}
              </span>
              {item.note && (
                <span className="truncate border-l border-white/10 pl-1.5">
                  {item.note}
                </span>
              )}
            </div>

            <p className="text-[10px] md:text-xs text-gray-600 font-mono mt-0.5">
              {new Date(item.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`text-xs sm:text-sm md:text-lg font-bold font-mono tracking-tight whitespace-nowrap ${amountClass}`}
          >
            {isIncome ? "+" : "-"}₹{Number(item.amount).toLocaleString()}
          </span>

          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-1 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Edit"
            >
              <FiEdit2
                size={11}
                className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]"
              />
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="p-1 rounded-lg md:rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-colors"
              aria-label="Delete"
            >
              <FiTrash2
                size={11}
                className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
