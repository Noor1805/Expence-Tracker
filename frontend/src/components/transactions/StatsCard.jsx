import { ArrowUp, ArrowDown, Scale } from "lucide-react";

const ICON_MAP = {
  Income: <ArrowUp size={18} color="green" />,
  Expense: <ArrowDown size={18} color="red" />,
  Balance: <Scale size={18} color="orange" />,
};

export default function StatsCard({ title, value }) {
  return (
    <div
      className="
        relative
        rounded-2xl
        p-5
        bg-white/[10%]
        backdrop-blur-lg
        border border-white/10
        shadow-[0_20px_40px_rgba(0,0,0,0.6)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute inset-x-0 top-0 h-[1px]
          bg-gradient-to-r
          from-transparent via-white to-transparent
        "
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{title}</span>

        <span
          className="
            p-2 rounded-lg
            bg-black/30
            border border-white/10
            text-gray-300
          "
        >
          {ICON_MAP[title]}
        </span>
      </div>

      <div className="mt-4 text-3xl font-semibold text-orange-400 tracking-tight">
        {value}
      </div>
    </div>
  );
}
