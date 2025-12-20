import { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { ThemeContext } from "../../context/ThemeContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ data }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const chartTextColor = isDark ? "#9ca3af" : "#4b5563";

  const chartData = {
    labels: data.map((c) => c._id),
    datasets: [
      {
        data: data.map((c) => c.total),
        backgroundColor: [
          "#F472B6",
          "#22D3EE",
          "#FBBF24",
          "#A78BFA",
          "#34D399",
          "#FB7185",
          "#60A5FA",
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: chartTextColor },
      },
    },
  };

  return (
    <div className="w-full h-full relative">
      {data && data.length > 0 ? (
        <Doughnut data={chartData} options={options} />
      ) : (
        <p className="text-gray-500 text-center mt-20">No category data</p>
      )}
    </div>
  );
}
