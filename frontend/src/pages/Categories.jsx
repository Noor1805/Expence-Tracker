import { useEffect, useState } from "react";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import CategoryHistoryModal from "../components/categories/CategoryHistoryModal";
import api from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(null); // State for history modal
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data.data || res.data); // Handle potential response structure variations
    } catch (err) {
      console.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = () => {
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="space-y-8 pb-10 animate-fadeIn">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-white tracking-wide drop-shadow-lg">
          Categories
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your income and expense sources
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <CategoryForm
              editingCategory={editingCategory}
              onSuccess={handleSave}
              onCancel={() => setEditingCategory(null)}
            />
          </div>
        </div>

        {/* Right Column: List */}
        <div className="xl:col-span-2">
          <div className="p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl border border-[#1a1a25] shadow-lg min-h-[500px]">
            <h2 className="text-xl font-medium text-white mb-6">
              Your Categories
            </h2>
            <CategoryList
              categories={categories}
              loading={loading}
              onEdit={setEditingCategory}
              onViewHistory={setViewingHistory} // Pass handler
              onDelete={fetchCategories}
            />
          </div>
        </div>
      </div>

      {/* History Modal */}
      {viewingHistory && (
        <CategoryHistoryModal
          category={viewingHistory}
          onClose={() => setViewingHistory(null)}
        />
      )}
    </div>
  );
}
