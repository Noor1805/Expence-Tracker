export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-semibold text-white tracking-wide drop-shadow-lg">
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl 
        border border-[#1a1a25] shadow-[0_0_20px_rgba(80,150,255,0.15)] 
        hover:shadow-[0_0_25px_rgba(80,150,255,0.35)] transition-transform 
        hover:-translate-y-1 duration-300"
        >
          <h2 className="text-gray-400 text-sm">Balance</h2>
          <p className="text-3xl font-semibold text-[#4aa8ff] mt-2">₹0</p>
          <span className="text-[#4aa8ff] text-sm">72%</span>
        </div>

        <div
          className="p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl 
        border border-[#26131a] shadow-[0_0_20px_rgba(255,80,120,0.15)]
        hover:shadow-[0_0_25px_rgba(255,80,120,0.35)] transition-transform 
        hover:-translate-y-1 duration-300"
        >
          <h2 className="text-gray-400 text-sm">Expense</h2>
          <p className="text-3xl font-semibold text-[#ff5e7e] mt-2">₹0</p>
          <span className="text-[#ff5e7e] text-sm">28%</span>
        </div>

        <div
          className="p-6 rounded-2xl bg-[rgba(15,15,20,0.8)] backdrop-blur-xl 
        border border-[#123122] shadow-[0_0_20px_rgba(45,200,140,0.15)] 
        hover:shadow-[0_0_25px_rgba(45,200,140,0.35)] transition-transform 
        hover:-translate-y-1 duration-300"
        >
          <h2 className="text-gray-400 text-sm">Income</h2>
          <p className="text-3xl font-semibold text-[#2dcc8d] mt-2">₹0</p>
          <span className="text-[#2dcc8d] text-sm">100%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          className="xl:col-span-1 p-6 h-[350px] rounded-2xl 
        bg-[rgba(15,15,20,0.8)] backdrop-blur-xl 
        border border-[#1a1a25] shadow-[0_0_20px_rgba(80,130,255,0.1)]
        hover:shadow-[0_0_25px_rgba(80,130,255,0.25)] transition 
        flex items-center justify-center"
        >
          <p className="text-gray-500">Categories will go here</p>
        </div>

        <div
          className="xl:col-span-2 p-6 h-[350px] rounded-2xl 
        bg-gradient-to-br from-[#10101a] to-[#0a0a0f] backdrop-blur-xl 
        border border-[#231a32] shadow-[0_0_25px_rgba(150,80,255,0.15)]
        hover:shadow-[0_0_30px_rgba(150,80,255,0.3)] transition 
        flex items-center justify-center"
        >
          <p className="text-gray-500">Statistics graph here</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          className="p-6 h-[300px] rounded-2xl 
        bg-[rgba(15,15,20,0.8)] backdrop-blur-xl
        border border-[#12323b] shadow-[0_0_20px_rgba(80,220,255,0.1)]
        hover:shadow-[0_0_25px_rgba(80,220,255,0.3)] transition 
        flex items-center justify-center"
        >
          <p className="text-gray-500">Pie chart here</p>
        </div>

        <div
          className="xl:col-span-2 p-6 h-[300px] rounded-2xl 
        bg-[rgba(15,15,20,0.8)] backdrop-blur-xl
        border border-[#1b1b25] shadow-[0_0_20px_rgba(120,120,255,0.1)]
        hover:shadow-[0_0_25px_rgba(120,120,255,0.3)] transition"
        >
          <h2 className="text-white font-semibold text-lg mb-4">Reminders</h2>
          <p className="text-gray-500">No reminders...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-2xl 
        bg-[rgba(15,15,20,0.8)] backdrop-blur-xl
        border border-[#1a1a25] shadow-[0_0_20px_rgba(80,150,255,0.12)]
        hover:shadow-[0_0_25px_rgba(80,150,255,0.25)] transition"
        >
          <h2 className="text-white font-semibold text-lg mb-4">
            Transactions
          </h2>
          <p className="text-gray-500">No transactions yet...</p>
        </div>

        <div
          className="p-6 rounded-2xl 
        bg-[rgba(15,15,20,0.8)] backdrop-blur-xl
        border border-[#2e2314] shadow-[0_0_20px_rgba(255,200,100,0.12)]
        hover:shadow-[0_0_25px_rgba(255,200,100,0.25)] transition"
        >
          <h2 className="text-white font-semibold text-lg mb-4">Upcoming</h2>
          <p className="text-gray-500">No upcoming bills...</p>
        </div>
      </div>
    </div>
  );
}
