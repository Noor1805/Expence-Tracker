export default function BudgetSummaryCard({ budgets }) {
  const totalLimit = budgets.reduce((a, b) => a + (b.limit || 0), 0);
  const totalSpent = budgets.reduce((a, b) => a + (b.spent || 0), 0);
  const remaining = Math.max(totalLimit - totalSpent, 0);

  const StatCard = ({ title, amount, color, borderColor }) => (
    <div
      className={`relative overflow-hidden p-6 rounded-[25px] bg-[#111] border border-white/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] group hover:translate-y-[-2px] transition-all duration-300`}
      style={{ borderBottom: `4px solid ${borderColor}` }}
    >
      <div className="relative z-10">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
          {title}
        </p>
        <h3
          className="text-3xl audiowide-regular tracking-wide"
          style={{ color: color }}
        >
          ₹{amount.toLocaleString()}
        </h3>
      </div>
      {/* Glow Effect */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
        style={{ background: borderColor }}
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Budget"
        amount={totalLimit}
        color="#22d3ee" // Cyan
        borderColor="#06b6d4"
      />
      <StatCard
        title="Total Spent"
        amount={totalSpent}
        color="#fb923c" // Orange
        borderColor="#f97316"
      />
      <StatCard
        title="Remaining"
        amount={remaining}
        color={remaining > 0 ? "#34d399" : "#ff4d4d"} // Emerald or Red
        borderColor={remaining > 0 ? "#10b981" : "#ef4444"}
      />
    </div>
  );
}
