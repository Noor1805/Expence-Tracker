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
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", { params: filters });
      // backend returned { success, data, total, ... } earlier in your code
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error("Fetch transactions", err);
    } finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/transactions/stats/total");
      if (res.data) {
        // your backend returns keys maybe at top level, inspect and adjust
        const d = res.data;
        setStats({
          totalIncome: d.totalIncome ?? d.totalIncome ?? 0,
          totalExpense: d.totalExpense ?? d.totalExpense ?? 0,
          balance: (d.totalIncome ?? 0) - (d.totalExpense ?? 0),
        });
      }
    } catch (err) { console.error("stats err", err); }
  };

  useEffect(() => {
    fetchTransactions();
    fetchStats();
    // eslint-disable-next-line
  }, [filters.page, filters.limit]);

  // apply filter button triggers new fetch with fresh filters
  const applyFilters = () => {
    // page reset
    setFilters(f => ({ ...f, page: 1 }));
    fetchTransactions();
  };

  // add new transaction
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

  const handleEdit = (item) => {
    setEditing(item);
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
      fetchStats();
    } catch (err) {
      console.error("delete err", err);
      alert("Delete failed");
    }
  };

  const handleImportSuccess = () => {
    fetchTransactions();
    fetchStats();
  };

  return (
    <div className="space-y-6">
      {/* top row: stats + controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Transactions</h1>
            <div className="flex gap-3">
              <button onClick={() => { setEditing(null); setShowAdd(true); }} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold">+ Add</button>
              <button onClick={() => setShowImport(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-semibold">Import</button>
            </div>
          </div>

          <TransactionFilters filters={filters} setFilters={setFilters} onApply={applyFilters} onOpenImport={() => setShowImport(true)} />

          {/* stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard title="Income" value={`₹${stats.totalIncome}`} accent="text-green-400" />
            <StatsCard title="Expense" value={`₹${stats.totalExpense}`} accent="text-red-400" />
            <StatsCard title="Balance" value={`₹${stats.balance}`} accent="text-cyan-400" />
          </div>
        </div>

        {/* recent / mini list column */}
        <aside className="hidden lg:block">
          <div className="glass neo rounded-2xl p-4" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
            <h3 className="text-sm text-gray-300 mb-3">Recent</h3>
            {transactions.slice(0, 5).map(t => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                <div>
                  <div className="text-white">{t.category}</div>
                  <div className="text-gray-400 text-xs">{t.paymentMethod}</div>
                </div>
                <div className={`text-sm ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>₹{t.amount}</div>
              </div>
            ))}
            {transactions.length === 0 && <div className="text-gray-400 text-sm">No recent</div>}
          </div>
        </aside>
      </div>

      {/* main grid of transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass neo rounded-2xl p-4 animate-pulse h-28" />
          ))
        ) : transactions.length === 0 ? (
          <div className="glass neo rounded-2xl p-8 text-center md:col-span-2 xl:col-span-3">
            <h3 className="text-lg text-gray-200">No transactions yet</h3>
            <p className="text-gray-400">Add your first transaction or import a CSV</p>
          </div>
        ) : (
          transactions.map(t => (
            <TransactionCard key={t._id} item={t} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* pagination simple */}
      <div className="flex items-center justify-center mt-4 gap-3">
        <button disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="px-3 py-2 bg-white/5 rounded-xl">Prev</button>
        <span className="text-gray-300">Page {filters.page}</span>
        <button onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="px-3 py-2 bg-white/5 rounded-xl">Next</button>
      </div>

      {/* modals */}
      <AddEditTransactionForm open={showAdd} onClose={() => { setShowAdd(false); setEditing(null); }} onSave={handleSave} initial={editing} />
      <ImportCSVModal open={showImport} onClose={() => setShowImport(false)} onImported={handleImportSuccess} />
    </div>
  );
}

