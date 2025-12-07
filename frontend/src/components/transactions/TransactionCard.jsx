// src/components/transactions/TransactionCard.jsx
import React from "react";

export default function TransactionCard({ item, onEdit, onDelete }) {
  const amountClass = item.type === "income" ? "text-green-400" : "text-red-400";
  const accent =
    item.categoryColor || (item.type === "income" ? "bg-green-500/20" : "bg-red-500/20");

  return (
    <div
      className="glass neo rounded-2xl p-4 flex items-center justify-between gap-4 animate-fadeInUp"
      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${accent}`}
          style={{ minWidth: 48 }}
        >
          {/* color dot or icon placeholder */}
          <span className="text-sm text-white/90 font-semibold">{item.category?.charAt(0) || "C"}</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm md:text-base font-semibold text-white">{item.category}</h3>
            <span className="text-xs text-gray-400">{item.paymentMethod}</span>
          </div>

          <p className="text-xs text-gray-400 mt-1 hidden md:block">{item.note}</p>
          <p className="text-xs text-gray-500 mt-1">{new Date(item.date).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-lg font-bold md:text-2xl">
          <span className={amountClass}>{item.type === "income" ? "+" : "-"} ₹{item.amount}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/8"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="px-3 py-1 rounded-lg text-xs bg-red-600/20 hover:bg-red-600/30 text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
