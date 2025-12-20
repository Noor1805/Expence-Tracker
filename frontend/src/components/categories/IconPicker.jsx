import {
  FiShoppingCart,
  FiEdit2,
  FiHome,
  FiCoffee,
  FiActivity,
  FiBriefcase,
  FiBook,
  FiPhone,
  FiDroplet,
  FiList,
  FiMusic,
  FiGlobe,
  FiPieChart,
  FiGift,
} from "react-icons/fi";

export const ICONS = [
  { id: "cart", icon: <FiShoppingCart /> },
  { id: "edit", icon: <FiEdit2 /> },
  { id: "home", icon: <FiHome /> },
  { id: "food", icon: <FiCoffee /> },
  { id: "health", icon: <FiActivity /> },
  { id: "work", icon: <FiBriefcase /> },
  { id: "study", icon: <FiBook /> },
  { id: "phone", icon: <FiPhone /> },
  { id: "drop", icon: <FiDroplet /> },
  { id: "list", icon: <FiList /> },
  { id: "fun", icon: <FiMusic /> },
  { id: "chart", icon: <FiPieChart /> },
];

export default function IconPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {ICONS.map((i) => (
        <button
          key={i.id}
          type="button"
          onClick={() => onChange(i.id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all
            ${
              value === i.id
                ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.6)] scale-110"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          {i.icon}
        </button>
      ))}
    </div>
  );
}
