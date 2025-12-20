import { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyChart({ data, type = "income" }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const chartTextColor = isDark ? "#9ca3af" : "#4b5563";
  const chartGridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

  const isIncome = type === "income";
  const label = isIncome ? "Income" : "Expense";
  const color = isIncome ? "#34D399" : "#F87171";
  const dataKey = isIncome ? "dailyIncome" : "dailyExpense";

  const chartData = {
    labels: data.map((b) => `${b._id.day}/${b._id.month}`),
    datasets: [
      {
        label: label,
        data: data.map((b) => b[dataKey]),
        backgroundColor: color,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: chartTextColor },
        grid: { color: chartGridColor },
      },
      y: {
        ticks: { color: chartTextColor },
        grid: { color: chartGridColor },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
