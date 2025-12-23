import { useEffect, useState } from "react";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import CategoryHistoryModal from "../components/categories/CategoryHistoryModal";
import categoryService from "../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSuccess = () => {
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-[#05080d] p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="w-full xl:col-span-1 xl:sticky xl:top-6">
          <CategoryForm
            editingCategory={editingCategory}
            onSuccess={handleSuccess}
          />
        </div>

        <div className="w-full  xl:col-span-2">
          <h2 className="text-white audiowide-regular text-center text-4xl font-bold mb-6">
            Your Categories
          </h2>
          <CategoryList
            categories={categories}
            loading={loading}
            onEdit={setEditingCategory}
            onDelete={fetchCategories}
            onViewHistory={setViewingHistory}
          />
        </div>
      </div>

      {viewingHistory && (
        <CategoryHistoryModal
          category={viewingHistory}
          onClose={() => setViewingHistory(null)}
        />
      )}
    </div>
  );
}
