export default function TransactionTable({ transactions }) {
  return (
    <table className="w-full mt-4 bg-[#101014] rounded-2xl border border-gray-800">
      <thead className="text-gray-400 text-sm">
        <tr>
          <th className="p-3 text-left">Type</th>
          <th className="p-3 text-left">Category</th>
          <th className="p-3 text-left">Amount</th>
          <th className="p-3 text-left">Payment</th>
          <th className="p-3 text-left">Date</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((t) => (
          <tr
            key={t._id}
            className="border-t border-gray-800 hover:bg-gray-900/40 transition"
          >
            <td className="p-3 text-red-400">{t.type}</td>
            <td className="p-3 text-gray-300">{t.category}</td>
            <td className="p-3 text-white">₹{t.amount}</td>
            <td className="p-3 text-gray-400">{t.paymentMethod}</td>
            <td className="p-3 text-gray-500">
              {new Date(t.date).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
