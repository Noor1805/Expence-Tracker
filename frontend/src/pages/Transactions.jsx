// src/pages/Transactions.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

import StatsCard from "../components/transactions/StatsCard";
import TransactionCard from "../components/transactions/TransactionCard";
import TransactionFilters from "../components/transactions/TransactionFilters";
import AddEditTransactionForm from "../components/transactions/AddEditTransactionForm";
import ImportCSVModal from "../components/transactions/ImportCSVModal";

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
    <div className="relative space-y-8">
      <div className="flex items-center z-50 justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Transactions
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditing(null);
              setShowAdd(true);
            }}
            className="
              px-5 py-2.5 rounded-full font-semibold
              bg-gradient-to-r from-orange-500 to-orange-600
              text-black
              shadow-[0_0_25px_rgba(249,115,22,0.55)]
              hover:shadow-[0_0_35px_rgba(249,115,22,0.75)]
              transition-all
            "
          >
            + Add
          </button>

          <button
            onClick={() => setShowImport(true)}
            className="
              px-5 py-2.5 rounded-full font-semibold
              bg-black/40 text-orange-400
              border border-orange-500/40
              hover:bg-black/60
              hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]
              transition-all
            "
          >
            Import
          </button>
        </div>
      </div>
      <TransactionFilters
        filters={filters}
        setFilters={setFilters}
        onApply={applyFilters}
        onOpenImport={() => setShowImport(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Income" value={`₹${stats.totalIncome}`} />
        <StatsCard title="Expense" value={`₹${stats.totalExpense}`} />
        <StatsCard title="Balance" value={`₹${stats.balance}`} />
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="glass rounded-2xl h-[260px] animate-pulse" />
        ) : transactions.length === 0 ? (
          <div
            className="
            glass rounded-3xl h-[320px]
            flex flex-col items-center justify-center
            text-gray-400
          "
          >
            <div className="text-5xl mb-4 opacity-40">📦</div>
            <p className="text-lg">No transactions yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          disabled={filters.page <= 1}
          onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
          className="
            px-4 py-2 rounded-xl
            bg-black/40 text-orange-400
            border border-orange-500/30
            disabled:opacity-40
            hover:bg-black/60
          "
        >
          Prev
        </button>

        <span className="text-gray-300">Page {filters.page}</span>

        <button
          onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
          className="
            px-4 py-2 rounded-xl
            bg-black/40 text-orange-400
            border border-orange-500/30
            hover:bg-black/60
          "
        >
          Next
        </button>
      </div>

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
  );
}
