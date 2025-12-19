export default function BudgetProgress({ used, limit }) {
  const percent = Math.min((used / limit) * 100, 100);

  const color =
    percent < 70
      ? "bg-green-500"
      : percent < 90
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Used: ₹{used}</span>
        <span>{percent.toFixed(0)}%</span>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
