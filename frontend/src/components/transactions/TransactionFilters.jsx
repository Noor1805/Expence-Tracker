// src/components/transactions/TransactionFilters.jsx
import React from "react";

export default function TransactionFilters({ filters, setFilters, onApply, onOpenImport }) {
  return (
    <div className="glass neo rounded-2xl p-4 flex flex-wrap gap-3 items-center"
      style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
      
      <input
        className="px-3 py-2 rounded-xl bg-black/30 text-white border border-white/5 outline-none"
        placeholder="Search notes..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      <select
        className="px-3 py-2 rounded-xl bg-black/30 text-white border border-white/5"
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        className="px-3 py-2 rounded-xl bg-black/30 text-white border border-white/5"
        value={filters.paymentMethod}
        onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
      >
        <option value="">All Methods</option>
        <option value="upi">UPI</option>
        <option value="card">Card</option>
        <option value="cash">Cash</option>
      </select>

      <input
        type="date"
        className="px-3 py-2 rounded-xl bg-black/30 text-white border border-white/5"
        value={filters.startDate}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
      />

      <input
        type="date"
        className="px-3 py-2 rounded-xl bg-black/30 text-white border border-white/5"
        value={filters.endDate}
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
      />

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onOpenImport}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-semibold"
        >
          Import CSV
        </button>

        <button
          onClick={() => { setFilters({}); onApply(); }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
        >
          Reset
        </button>

        <button
          onClick={onApply}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
