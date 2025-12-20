export default function TransactionFilters({ filters, setFilters, onApply }) {
  return (
    <div className="w-full glass neo p-4 md:p-6 rounded-[30px] mb-8 border border-white/5 relative overflow-hidden">
      {/* Search Bar - Full Width */}
      <div className="mb-4 md:mb-6 relative">
        <input
          type="text"
          placeholder="Search by note..."
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
          className="w-full px-5 py-3 md:py-4 rounded-2xl bg-[#111] text-gray-200 placeholder-gray-500 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="w-full px-5 py-3 rounded-2xl bg-[#1a1a1a] text-gray-300 border border-white/10 outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Payment Filter */}
        <select
          value={filters.paymentMethod}
          onChange={(e) =>
            setFilters((f) => ({ ...f, paymentMethod: e.target.value }))
          }
          className="w-full px-5 py-3 rounded-2xl bg-[#1a1a1a] text-gray-300 border border-white/10 outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>

        {/* Start Date */}
        <div className="flex flex-col">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, startDate: e.target.value }))
            }
            className="w-full px-5 py-3 rounded-2xl bg-[#1a1a1a] text-gray-300 border border-white/10 outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, endDate: e.target.value }))
            }
            className="w-full px-5 py-3 rounded-2xl bg-[#1a1a1a] text-gray-300 border border-white/10 outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onApply}
          className="
            w-full md:w-auto px-8 py-3 rounded-2xl font-bold tracking-wide
            bg-gradient-to-r from-cyan-600 to-blue-600
            text-white
            shadow-lg shadow-cyan-500/20
            hover:shadow-cyan-500/40 hover:-translate-y-0.5
            transition-all
          "
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
