// src/pages/Transactions.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

import StatsCard from "../components/transactions/StatsCard";
import TransactionCard from "../components/transactions/TransactionCard";
import TransactionFilters from "../components/transactions/TransactionFilters";
import AddEditTransactionForm from "../components/transactions/AddEditTransactionForm";
import ImportCSVModal from "../components/transactions/ImportCSVModal";
import { motion } from "framer-motion";

export default function Transactions() {
  const [filters, setFilters] = useState({
    type: "",
    paymentMethod: "",
    search: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 12,
  });

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await api.put(`/transactions/${editing._id}`, payload);
        setEditing(null);
      } else {
        await api.post("/transactions/create", payload);
      }
      setShowAdd(false);
      fetchTransactions();
      fetchStats();
    } catch (err) {
      console.error("save err", err);
      alert("Save failed");
    }
  };

  const handleImportSuccess = () => {
    fetchTransactions();
    fetchStats();
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", { params: filters });
      setTransactions(res.data.data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/transactions/stats/total");
      if (res.data && res.data.data) {
        const d = res.data.data;
        setStats({
          totalIncome: d.totalIncome ?? 0,
          totalExpense: d.totalExpense ?? 0,
          balance: d.balance ?? (d.totalIncome ?? 0) - (d.totalExpense ?? 0),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, [filters.page, filters.limit]);

  const applyFilters = () => {
    setFilters((f) => ({ ...f, page: 1 }));
    fetchTransactions();
  };

  return (
    <div className="min-h-screen bg-[#05080d] p-2 sm:p-4 md:p-8 lg:p-10 pb-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-5xl font-bold text-white tracking-widest audiowide-regular mb-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              TRANSACTIONS
            </h1>
            <p className="text-gray-400 ml-1 text-sm md:text-base">
              Track every penny
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full lg:w-auto lg:flex">
            <button
              onClick={() => {
                setEditing(null);
                setShowAdd(true);
              }}
              className="
                col-span-1
                w-full lg:w-auto
                px-3 py-2.5 sm:px-5 sm:py-3
                rounded-xl sm:rounded-[18px]
                font-bold tracking-wide
                bg-gradient-to-r from-cyan-600 to-blue-600
                text-white text-xs sm:text-sm md:text-base
                shadow-lg shadow-cyan-500/20
                hover:shadow-cyan-500/40 hover:-translate-y-0.5
                active:scale-95
                transition-all
                whitespace-nowrap
              "
            >
              + New
            </button>

            <button
              onClick={() => setShowImport(true)}
              className="
                col-span-1
                w-full lg:w-auto
                px-3 py-2.5 sm:px-5 sm:py-3
                rounded-xl sm:rounded-[18px]
                font-bold tracking-wide
                bg-[#1a1a1a] text-cyan-400 text-xs sm:text-sm md:text-base
                border border-cyan-500/30
                hover:bg-cyan-500/10
                active:scale-95
                transition-all
                whitespace-nowrap
              "
            >
              Import
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <TransactionFilters
          filters={filters}
          setFilters={setFilters}
          onApply={applyFilters}
          onOpenImport={() => setShowImport(true)}
        />

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          <StatsCard
            title="Income"
            value={`₹${stats.totalIncome.toLocaleString()}`}
            color="text-emerald-400"
            border="border-emerald-500"
          />
          <StatsCard
            title="Expense"
            value={`₹${stats.totalExpense.toLocaleString()}`}
            color="text-red-400"
            border="border-red-500"
          />
          <StatsCard
            title="Balance"
            value={`₹${stats.balance.toLocaleString()}`}
            color="text-cyan-400"
            border="border-cyan-500"
          />
        </div>

        {/* LIST */}
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div
              className="
                p-12 rounded-[30px] border border-dashed border-white/10
                flex flex-col items-center justify-center
                text-gray-500 bg-[#111]
                "
            >
              <div className="text-5xl mb-4 opacity-50 grayscale">📦</div>
              <p className="text-xl font-medium">No transactions found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
              {transactions.map((t) => (
                <TransactionCard
                  key={t._id}
                  item={t}
                  onEdit={(item) => {
                    setEditing(item);
                    setShowAdd(true);
                  }}
                  onDelete={async (id) => {
                    if (!confirm("Delete transaction?")) return;
                    await api.delete(`/transactions/${id}`);
                    fetchTransactions();
                    fetchStats();
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex flex-wrap justify-between sm:justify-center items-center gap-3 pt-6 md:pt-8 w-full">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            className="
                flex-1 sm:flex-none
                px-4 py-2.5 sm:px-6 sm:py-3
                rounded-xl
                bg-[#1a1a1a] text-gray-300
                border border-white/10
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:border-cyan-500/50 hover:text-cyan-400
                transition-all
                text-sm sm:text-base
            "
          >
            Previous
          </button>

          <span className="text-gray-400 font-mono bg-[#111] px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/5 text-sm sm:text-base whitespace-nowrap">
            Page {filters.page}
          </span>

          <button
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            className="
                flex-1 sm:flex-none
                px-4 py-2.5 sm:px-6 sm:py-3
                 rounded-xl
                bg-[#1a1a1a] text-gray-300
                border border-white/10
                hover:border-cyan-500/50 hover:text-cyan-400
                transition-all
                text-sm sm:text-base
            "
          >
            Next
          </button>
        </div>

        {/* MODALS */}
        <AddEditTransactionForm
          open={showAdd}
          onClose={() => {
            setShowAdd(false);
            setEditing(null);
          }}
          onSave={handleSave}
          initial={editing}
        />

        <ImportCSVModal
          open={showImport}
          onClose={() => setShowImport(false)}
          onImported={handleImportSuccess}
        />
      </div>
    </div>
  );
}
