import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, recentRes, catRes, monthRes, payRes, balRes, upRes] =
        await Promise.all([
          api.get("/transactions/stats/total"),
          api.get("/transactions/recent"),
          api.get("/transactions/stats/category"),
          api.get("/transactions/stats/monthly"),
          api.get("/transactions/stats/payment-method"),
          api.get("/transactions/stats/balance"),
          api.get("/transactions/upcoming"),
        ]);

      setStats(statsRes.data.data);
      setRecentTransactions(recentRes.data.data || []);
      setCategoryStats(catRes.data.data || []);
      setMonthlyStats(monthRes.data.data || []);
      setPaymentStats(payRes.data.data || []);
      setBalanceHistory(balRes.data.data || []);
      setUpcoming(upRes.data.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categoryChartData = {
    labels: categoryStats.map((c) => c._id),
    datasets: [
      {
        data: categoryStats.map((c) => c.total),
        backgroundColor: [
          "#F472B6",
          "#22D3EE",
          "#FBBF24",
          "#A78BFA",
          "#34D399",
          "#FB7185",
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyStats.map((m) => `${m._id.month}/${m._id.year}`),
    datasets: [
      {
        label: "Income",
        data: monthlyStats
          .filter((m) => m._id.type === "income")
          .map((m) => m.total),
        borderColor: "#34D399",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(52, 211, 153, 0.4)");
          gradient.addColorStop(1, "rgba(52, 211, 153, 0.05)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
      },
      {
        label: "Expense",
        data: monthlyStats
          .filter((m) => m._id.type === "expense")
          .map((m) => m.total),
        borderColor: "#F87171",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(248, 113, 113, 0.4)");
          gradient.addColorStop(1, "rgba(248, 113, 113, 0.05)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const paymentChartData = {
    labels: paymentStats.map((p) => p._id.toUpperCase()),
    datasets: [
      {
        label: "Spending",
        data: paymentStats.map((p) => p.total),
        backgroundColor: ["#A78BFA", "#F472B6", "#22D3EE", "#FBBF24"],
        borderRadius: 8,
      },
    ],
  };

  const cumulativeData = balanceHistory.reduce((acc, curr) => {
    const dailyNet = (curr.dailyIncome || 0) - (curr.dailyExpense || 0);
    const prevBalance = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(prevBalance + dailyNet);
    return acc;
  }, []);

  const balanceChartData = {
    labels: balanceHistory.map((b) => `${b._id.day}/${b._id.month}`),
    datasets: [
      {
        label: "Balance",
        data: cumulativeData,
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96, 165, 250, 0.1)",
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top", labels: { color: "#9ca3af" } } },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get("/transactions/export/pdf", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF download failed", err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <h1 className="text-3xl font-semibold text-white tracking-wide drop-shadow-lg">
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#1a1a25] shadow-lg relative overflow-hidden group hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-300">
          <div className="relative z-10">
            <h2 className="text-gray-400 text-sm">Balance</h2>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mt-2">
              ₹{stats.balance}
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-20 opacity-30 group-hover:opacity-50 transition-opacity">
            <Line
              data={balanceChartData}
              options={{
                ...chartOptions,
                scales: { x: { display: false }, y: { display: false } },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#26131a] shadow-lg hover:shadow-[0_0_25px_rgba(244,114,182,0.2)] transition-all duration-300">
          <h2 className="text-gray-400 text-sm">Expense</h2>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mt-2">
            ₹{stats.totalExpense}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#123122] shadow-lg hover:shadow-[0_0_25px_rgba(52,211,153,0.2)] transition-all duration-300">
          <h2 className="text-gray-400 text-sm">Income</h2>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 mt-2">
            ₹{stats.totalIncome}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#1a1a25] shadow-lg h-[350px]">
          <h3 className="text-gray-300 mb-6 text-lg font-medium">
            Balance History
          </h3>
          <div className="w-full h-[85%] relative">
            <Line data={balanceChartData} options={chartOptions} />
          </div>
        </div>

        <div className="xl:col-span-1 p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#123122] shadow-lg h-[350px]">
          <h3 className="text-emerald-400 mb-4 text-lg font-medium">
            Income Trend
          </h3>
          <div className="w-full h-[85%] relative">
            <Bar
              data={{
                labels: monthlyStats.map((m) => `${m._id.month}/${m._id.year}`),
                datasets: [
                  {
                    label: "Income",
                    data: monthlyStats
                      .filter((m) => m._id.type === "income")
                      .map((m) => m.total),
                    backgroundColor: "#34D399",
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                ...chartOptions,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#1a1a25] shadow-lg h-[350px] flex flex-col items-center justify-center">
          <h3 className="text-gray-300 mb-2 text-sm font-medium">
            Expense Categories
          </h3>
          <div className="w-full h-full relative">
            {categoryStats.length > 0 ? (
              <Doughnut
                data={categoryChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { color: "#9ca3af" },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-gray-500 text-center mt-20">
                No category data
              </p>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#26131a] shadow-lg h-[350px]">
          <h3 className="text-rose-400 mb-4 text-lg font-medium">
            Expense Trend
          </h3>
          <div className="w-full h-[85%] relative">
            <Bar
              data={{
                labels: monthlyStats.map((m) => `${m._id.month}/${m._id.year}`),
                datasets: [
                  {
                    label: "Expense",
                    data: monthlyStats
                      .filter((m) => m._id.type === "expense")
                      .map((m) => m.total),
                    backgroundColor: "#F87171",
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                ...chartOptions,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#1b1b25] shadow-lg h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-semibold text-lg">
              Recent Transactions
            </h2>
            <Link
              to="/app/transactions"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {recentTransactions.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 rounded-full bg-blue-500/20" />
                  <div>
                    <p className="text-white font-medium text-sm">
                      {t.category}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold text-sm ${
                    t.type === "income" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount}
                </span>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-gray-500 text-center py-10">
                No recent transactions
              </p>
            )}
          </div>
        </div>

        <div className="xl:col-span-1 p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#1a1a25] shadow-lg h-[400px] flex flex-col">
          <h2 className="text-white font-semibold text-lg mb-4">
            Upcoming Bills
          </h2>
          <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
            {upcoming.length > 0 ? (
              upcoming.map((u) => (
                <div
                  key={u._id}
                  className="flex justify-between p-3 bg-white/5 rounded-lg border-l-2 border-yellow-500"
                >
                  <span className="text-gray-300">
                    {u.category} ({u.recurringFrequency})
                  </span>
                  <span className="text-white font-bold">₹{u.amount}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recurring bills found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#12323b] shadow-lg h-[350px]">
          <h3 className="text-gray-300 mb-4 text-sm font-medium">
            Payment Methods
          </h3>
          <div className="w-full h-full pb-6 relative">
            <Bar data={paymentChartData} options={chartOptions} />
          </div>
        </div>
        <div className="xl:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-xl border border-white/5 shadow-lg h-[350px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl text-white font-bold mb-2">
              Detailed Reports
            </h3>
            <p className="text-gray-400">
              Download your financial statement in PDF format.
            </p>
            <button
              onClick={handleDownloadPDF}
              className="mt-6 px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-orange-500/30 active:scale-95"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
