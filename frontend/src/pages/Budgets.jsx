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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Budgets
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your monthly spending limits
          </p>
        </div>
      </div>

      <BudgetSummaryCard budgets={budgets} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <BudgetForm categories={categories} onSuccess={fetchAll} />
        </div>

        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Category Allocations
          </h2>

          {loading ? (
            <div className="text-center py-10 text-gray-500 animate-pulse">
              Loading budgets...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.length > 0 ? (
                budgets.map((b) => (
                  <CategoryBudgetItem
                    key={b._id}
                    budget={b}
                    onChange={fetchAll}
                  />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  No budgets set yet. Create one to get started!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
