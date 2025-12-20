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

export default function PaymentChart({ data }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const chartTextColor = isDark ? "#9ca3af" : "#4b5563";
  const chartGridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

  const chartData = {
    labels: data.map((p) => p._id.toUpperCase()),
    datasets: [
      {
        label: "Spending",
        data: data.map((p) => p.total),
        backgroundColor: data.map((p) => {
          const method = (p._id || "others").toUpperCase();
          switch (method) {
            case "UPI":
              return "#A78BFA";
            case "CARD":
              return "#22D3EE";
            case "CASH":
              return "#FBBF24";
            case "NET BANKING":
              return "#F472B6";
            default:
              return "#9CA3AF";
          }
        }),
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top", labels: { color: chartTextColor } } },
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
