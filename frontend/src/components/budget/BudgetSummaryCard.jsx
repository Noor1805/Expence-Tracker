export default function BudgetSummaryCard({ budgets }) {
  const totalLimit = budgets.reduce((a, b) => a + (b.limit || 0), 0);
  const totalSpent = budgets.reduce((a, b) => a + (b.spent || 0), 0);
  const remaining = Math.max(totalLimit - totalSpent, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass neo p-6 rounded-2xl border-l-[6px] border-blue-500 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-gray-400 text-sm font-medium">Total Budget</p>
          <h3 className="text-2xl text-white font-bold mt-2">
            ₹{totalLimit.toLocaleString()}
          </h3>
        </div>
        <div className="absolute right-0 top-0 w-24 h-full bg-blue-500/10 skew-x-12 translate-x-12 group-hover:translate-x-6 transition-transform" />
      </div>

      <div className="glass neo p-6 rounded-2xl border-l-[6px] border-orange-500 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-gray-400 text-sm font-medium">Total Spent</p>
          <h3 className="text-2xl text-orange-400 font-bold mt-2">
            ₹{totalSpent.toLocaleString()}
          </h3>
        </div>
        <div className="absolute right-0 top-0 w-24 h-full bg-orange-500/10 skew-x-12 translate-x-12 group-hover:translate-x-6 transition-transform" />
      </div>

      <div className="glass neo p-6 rounded-2xl border-l-[6px] border-emerald-500 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-gray-400 text-sm font-medium">Remaining</p>
          <h3 className="text-2xl text-emerald-400 font-bold mt-2">
            ₹{remaining.toLocaleString()}
          </h3>
        </div>
        <div className="absolute right-0 top-0 w-24 h-full bg-emerald-500/10 skew-x-12 translate-x-12 group-hover:translate-x-6 transition-transform" />
      </div>
    </div>
  );
}
