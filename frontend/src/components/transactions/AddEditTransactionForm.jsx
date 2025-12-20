
import React, { useEffect, useState } from "react";

export default function AddEditTransactionForm({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    paymentMethod: "upi",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  useEffect(() => {
    if (initial) setForm({ ...initial, date: initial.date ? initial.date.slice(0,10) : form.date });
  }, [initial]);

  useEffect(() => {
    if (!open) setForm({
      type: "expense",
      amount: "",
      category: "",
      paymentMethod: "upi",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    });
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) {
      alert("Amount and category required");
      return;
    }
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="glass neo rounded-2xl modal-max p-6" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 className="text-lg font-semibold text-white mb-4">{initial ? "Edit" : "Add"} Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <select className="flex-1 px-3 py-2 rounded-xl bg-black/20 text-white" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input type="number" placeholder="Amount" className="w-36 px-3 py-2 rounded-xl bg-black/20 text-white"
              value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          </div>

          <input placeholder="Category" className="w-full px-3 py-2 rounded-xl bg-black/20 text-white"
            value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />

          <div className="flex gap-2">
            <select className="flex-1 px-3 py-2 rounded-xl bg-black/20 text-white" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>

            <input type="date" className="w-40 px-3 py-2 rounded-xl bg-black/20 text-white" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>

          <textarea placeholder="Note (optional)" className="w-full px-3 py-2 rounded-xl bg-black/20 text-white" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />

          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold">
              {initial ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
