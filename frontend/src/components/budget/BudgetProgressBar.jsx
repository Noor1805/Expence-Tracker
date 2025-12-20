export default function BudgetProgress({ used, limit }) {
  const percent = Math.min((used / limit) * 100, 100);

  // Dynamic Neon Colors
  let colorClass = "bg-emerald-500 shadow-[0_0_10px_#10b981]";
  if (percent > 70) colorClass = "bg-yellow-500 shadow-[0_0_10px_#eab308]";
  if (percent > 90) colorClass = "bg-red-500 shadow-[0_0_10px_#ef4444]";

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
        <span>Used: ₹{used.toLocaleString()}</span>
        <span>{percent.toFixed(0)}%</span>
      </div>

      <div className="w-full h-3 bg-[#0a0a0a] rounded-full overflow-hidden border border-white/5 relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
