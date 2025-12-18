import { useEffect, useState } from "react";
import { FiX, FiCalendar, FiFileText } from "react-icons/fi";
import api from "../../services/api";

export default function CategoryHistoryModal({ category, onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      fetchHistory();
    }
  }, [category]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/transactions?category=${category.name}&limit=50`
      );
      setTransactions(res.data.data.transactions || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div
        className="bg-[#1a1a25] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh]"
        style={{ boxShadow: `0 0 40px ${category.color}20` }}
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Transaction History
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="text-center py-10 text-gray-400">
              Loading history...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No transactions found for this category.
            </div>
          ) : (
            transactions.map((t) => (
              <div
                key={t._id}
                className="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <FiCalendar className="text-gray-500" />
                    {new Date(t.date).toLocaleDateString()}
                  </div>
                  {t.note && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <FiFileText />
                      {t.note}
                    </div>
                  )}
                </div>
                <div
                  className={`font-mono font-bold ${
                    t.type === "income" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}${t.amount}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-white/5 text-center text-xs text-gray-500">
          Showing last 50 transactions
        </div>
      </div>
    </div>
  );
}
