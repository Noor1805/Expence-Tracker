export default function TransactionFilters({ filters, setFilters, onApply }) {
  return (
    <div className="w-full glass neo p-5 rounded-2xl mb-5 border border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="w-full p-3 rounded-xl bg-black/40 text-gray-200 border border-white/10
                     focus:ring-2 focus:ring-blue-500 shadow-inner"
        >
          <option value="" className="text-black">
            All Types
          </option>
          <option value="income" className="text-black">
            Income
          </option>
          <option value="expense" className="text-black">
            Expense
          </option>
        </select>

        {/* Payment Method */}
        <select
          value={filters.paymentMethod}
          onChange={(e) =>
            setFilters((f) => ({ ...f, paymentMethod: e.target.value }))
          }
          className="w-full p-3 rounded-xl bg-black/40 text-gray-200 border border-white/10
                     focus:ring-2 focus:ring-teal-400 shadow-inner"
        >
          <option value="" className="text-black">
            All Payments
          </option>
          <option value="cash" className="text-black">
            Cash
          </option>
          <option value="card" className="text-black">
            Card
          </option>
          <option value="upi" className="text-black">
            UPI
          </option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search notes..."
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
          className="w-full p-3 rounded-xl bg-black/40 text-gray-200 placeholder-gray-500
                     border border-white/10 focus:ring-2 focus:ring-purple-400 shadow-inner"
        />
        

        {/* Date Range Selector */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Start Date */}
          <div className="flex flex-col w-full">
            <label className="text-xs text-gray-400 mb-1 ml-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, startDate: e.target.value }))
              }
              className="w-full p-3 rounded-xl bg-black/40 text-gray-200 border border-white/10
                 focus:ring-2 focus:ring-blue-400 shadow-inner"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col w-full">
            <label className="text-xs text-gray-400 mb-1 ml-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, endDate: e.target.value }))
              }
              className="w-full p-3 rounded-xl bg-black/40 text-gray-200 border border-white/10
                 focus:ring-2 focus:ring-purple-400 shadow-inner"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-4">
        <button
          onClick={onApply}
          className="px-6 py-2 rounded-xl font-semibold
                     bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
                     text-white shadow-lg hover:opacity-90 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
