// src/components/transactions/ImportCSVModal.jsx
import React, { useState } from "react";
import api from "../../services/api";

export default function ImportCSVModal({ open, onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const upload = async () => {
    if (!file) return alert("Select CSV file");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/transactions/import/csv", fd, { headers: { "Content-Type": "multipart/form-data" }});
      alert(res.data.message || "Imported");
      onImported();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Import failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="glass neo rounded-2xl p-6 w-[420px]" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 className="text-lg text-white mb-4">Import CSV</h3>
        <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5">Cancel</button>
          <button onClick={upload} className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-semibold">
            {loading ? "Importing..." : "Upload CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
