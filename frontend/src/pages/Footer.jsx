import footerImg from "../assets/images/fbg1.png";

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-[#050505]">
      
      <img
        src={footerImg}
        alt="footer decoration"
        className="
          absolute 
          right-[-120px] 
          bottom-[-120px] 
          w-[480px]
          rotate-180
          md:rotate-65
          opacity-80
          pointer-events-none
        "
      />

      <div
        className="
          relative z-10
          backdrop-blur-[1px] bg-black/10
          border-t border-orange-500/30
        "
      >
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-2xl audiowide-regular font-bold text-white tracking-tight">
              Mon<span className="text-orange-500">exa</span>
            </h2>
            <p className="text-gray-300 mt-4 text-sm leading-relaxed">
              Smart expense tracking platform built to help you
              control, analyze, and grow your finances with clarity.
            </p>
          </div>

          <div>
            <h3 className="text-white audiowide-regular font-semibold mb-4 tracking-wide">
              Product
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="hover:text-orange-400 transition cursor-pointer">
                Dashboard
              </li>
              <li className="hover:text-orange-400 transition cursor-pointer">
                Transactions
              </li>
              <li className="hover:text-orange-400 transition cursor-pointer">
                Budgets
              </li>
              <li className="hover:text-orange-400 transition cursor-pointer">
                Analytics
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white audiowide-regular font-semibold mb-4 tracking-wide">
              Company
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="hover:text-orange-400 transition cursor-pointer">
                Home
              </li>
              <li className="hover:text-orange-400 transition cursor-pointer">
                Features
              </li>
              <li className="hover:text-orange-400 transition cursor-pointer">
                Pricing
              </li>
              <li className="hover:text-orange-400 transition cursor-pointer">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white audiowide-regular font-semibold mb-4 tracking-wide">
              Stay Updated
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Get product updates and finance tips.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="
                  w-full px-4 py-2 rounded-xl
                  bg-black/50 text-gray-100 text-sm
                  placeholder:text-gray-400
                  border border-white/15
                  focus:outline-none
                  focus:border-orange-500/50
                "
              />
              <button
                className="
                  px-4 py-2 rounded-xl
                  bg-orange-500 text-black font-semibold
                  hover:bg-orange-400 transition
                "
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 py-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Monexa. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
