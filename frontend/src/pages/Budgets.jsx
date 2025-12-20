import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";

import BudgetForm from "../components/budget/BudgetForm";
import BudgetSummaryCard from "../components/budget/BudgetSummaryCard";
import CategoryBudgetItem from "../components/budget/CategoryBudgetItem";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [budgetRes, categoryRes] = await Promise.all([
        api.get("/budget"),
        api.get("/categories"),
      ]);
      setBudgets(budgetRes.data.data || []);

      const allCategories = categoryRes.data.data || [];
      const expenseCategories = allCategories.filter(
        (c) => c.type && c.type.toLowerCase() === "expense"
      );
      setCategories(expenseCategories);
    } catch (err) {
      console.error("Budget fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-[#05080d] p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-10"
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest audiowide-regular mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            BUDGETS
          </h1>
          <p className="text-gray-400 tracking-wide">
            Manage your monthly spending limits
          </p>
        </div>

        <BudgetSummaryCard budgets={budgets} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="w-full xl:col-span-1 xl:sticky xl:top-6">
            <BudgetForm categories={categories} onSuccess={fetchAll} />
          </div>

          <div className="w-full xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white audiowide-regular tracking-wide">
                Allocations
              </h2>
              <span className="text-sm text-gray-500 font-mono">
                {budgets.length} Active
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.length > 0 ? (
                  budgets.map((b) => (
                    <CategoryBudgetItem
                      key={b._id}
                      budget={b}
                      onChange={fetchAll}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-gray-500 bg-[#111] rounded-[30px] border border-dashed border-white/10">
                    <p className="text-lg mb-2">No budgets set yet.</p>
                    <p className="text-sm">Create one to start tracking!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
