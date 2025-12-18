import CategoryCard from "./CategoryCard";

export default function CategoryList({
  categories,
  loading,
  onEdit,
  onDelete,
  onViewHistory,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 mt-4 text-sm animate-pulse">
          Loading amazing categories...
        </p>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
        <p className="text-4xl mb-4">📂</p>
        <p className="text-gray-400">No categories found.</p>
        <p className="text-gray-500 text-sm">Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <CategoryCard
          key={cat._id}
          category={cat}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewHistory={onViewHistory}
        />
      ))}
    </div>
  );
}
