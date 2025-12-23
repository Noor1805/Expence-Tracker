import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import CategoryChart from "../components/analytics/CategoryChart";
import MonthlyChart from "../components/analytics/MonthlyChart";
import PaymentChart from "../components/analytics/PaymentChart";
import transactionService from "../services/transactionService";
import budgetService from "../services/budgetService";

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
import { Line } from "react-chartjs-2";

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
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

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
  const [budgetStats, setBudgetStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();

      const [
        statsRes,
        recentRes,
        catRes,
        monthRes,
        payRes,
        balRes,
        upRes,
        budgetRes,
      ] = await Promise.all([
        transactionService.getStats(),
        transactionService.getRecent(),
        transactionService.getCategoryStats(),
        transactionService.getMonthlyStats(),
        transactionService.getPaymentStats(),
        transactionService.getBalanceHistory(),
        transactionService.getUpcoming(),
        budgetService.getStats(month, year).catch(() => ({ data: null })),
      ]);

      setStats(
        statsRes.data || { totalIncome: 0, totalExpense: 0, balance: 0 }
      );
      setRecentTransactions(recentRes.data || []);
      setCategoryStats(catRes.data || []);
      setMonthlyStats(monthRes.data || []);
      setPaymentStats(payRes.data || []);
      setBalanceHistory(balRes.data || []);
      setUpcoming(upRes.data || []);
      setBudgetStats(budgetRes.data || {});

      // I will fetch the missing ones directly for now until I update the service to be strict.
      // Actually, I should update the service file FIRST to include these methods.
      // I will abort this replace and update service first.
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const chartTextColor = isDark ? "#9ca3af" : "#4b5563"; // gray-400 vs gray-600
  const chartGridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

  const chartOptions = {
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
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-wide">
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#1a1a25] shadow-lg dark:shadow-none relative overflow-hidden group hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-300">
          <div className="relative z-10">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm">
              Balance
            </h2>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 mt-2">
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

        <div className="p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#26131a] shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(244,114,182,0.2)] transition-all duration-300">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">Expense</h2>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-500 dark:to-rose-500 mt-2">
            ₹{stats.totalExpense}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#123122] shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(52,211,153,0.2)] transition-all duration-300">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">Income</h2>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500 mt-2">
            ₹{stats.totalIncome}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-yellow-900/20 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(251,191,36,0.2)] transition-all duration-300 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm">
              Budget Health
            </h2>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
              {budgetStats?.remainingBudget < 0 ? "-" : ""}₹
              {Math.abs(budgetStats?.remainingBudget || 0).toLocaleString()}
              <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-1">
                left
              </span>
            </p>
            <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full ${
                  budgetStats?.percentageUsed > 100
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(budgetStats?.percentageUsed || 0, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {budgetStats?.percentageUsed?.toFixed(0) || 0}% used of ₹
              {budgetStats?.overallBudget?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#1a1a25] shadow-lg dark:shadow-none h-[350px]">
          <h3 className="text-gray-900 dark:text-gray-300 mb-6 text-lg font-medium">
            Balance History
          </h3>
          <div className="w-full h-[85%] relative">
            <Line data={balanceChartData} options={chartOptions} />
          </div>
        </div>

        <div className="xl:col-span-1 p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#123122] shadow-lg dark:shadow-none h-[350px]">
          <h3 className="text-emerald-500 dark:text-emerald-400 mb-4 text-lg font-medium">
            Income Trend
          </h3>
          <div className="w-full h-[85%] relative">
            <div className="w-full h-[85%] relative">
              <MonthlyChart data={balanceHistory} type="income" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#1a1a25] shadow-lg dark:shadow-none h-[350px] flex flex-col items-center justify-center">
          <h3 className="text-gray-900 dark:text-gray-300 mb-2 text-sm font-medium">
            Expense Categories
          </h3>
          <div className="w-full h-full relative">
            {categoryStats.length > 0 ? (
              <CategoryChart data={categoryStats} />
            ) : (
              <p className="text-gray-500 text-center mt-20">
                No category data
              </p>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#26131a] shadow-lg dark:shadow-none h-[350px]">
          <h3 className="text-rose-500 dark:text-rose-400 mb-4 text-lg font-medium">
            Expense Trend
          </h3>
          <div className="w-full h-[85%] relative">
            <div className="w-full h-[85%] relative">
              <MonthlyChart data={balanceHistory} type="expense" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#1b1b25] shadow-lg dark:shadow-none h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-900 dark:text-white font-semibold text-lg">
              Recent Transactions
            </h2>
            <Link
              to="/app/transactions"
              className="text-sm text-blue-500 hover:text-blue-400"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {recentTransactions.map((t) => (
              <div
                key={t._id}
                className="group flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      t.type === "income"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    <span className="font-bold text-lg">{t.category?.[0]}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-gray-900 dark:text-white font-bold text-sm truncate pr-2">
                      {t.category}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-black/20 px-1.5 py-0.5 rounded">
                        {t.paymentMethod}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(t.date).getDate()}/
                        {new Date(t.date).getMonth() + 1}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`font-bold font-mono text-sm whitespace-nowrap ml-2 shrink-0 ${
                    t.type === "income"
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
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

        <div className="xl:col-span-1 p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#1a1a25] shadow-lg dark:shadow-none h-[400px] flex flex-col">
          <h2 className="text-gray-900 dark:text-white font-semibold text-lg mb-4">
            Upcoming Bills
          </h2>
          <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
            {upcoming.length > 0 ? (
              upcoming.map((u) => (
                <div
                  key={u._id}
                  className="flex justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border-l-2 border-yellow-500"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {u.category} ({u.recurringFrequency})
                  </span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    ₹{u.amount}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recurring bills found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 p-6 rounded-2xl bg-white dark:bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-gray-200 dark:border-[#12323b] shadow-lg dark:shadow-none h-[350px]">
          <h3 className="text-gray-900 dark:text-gray-300 mb-4 text-sm font-medium">
            Payment Methods
          </h3>
          <div className="w-full h-full pb-6 relative">
            <PaymentChart data={paymentStats} />
          </div>
        </div>

        <div className="xl:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-xl border border-gray-200 dark:border-white/5 shadow-lg dark:shadow-none h-[350px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl text-gray-900 dark:text-white font-bold mb-2">
              Detailed Reports
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
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
