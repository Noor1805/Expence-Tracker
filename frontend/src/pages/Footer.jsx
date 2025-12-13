import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#0b0b0b] border-t border-black/5 dark:border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Monizey
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your premium personal finance partner.
        </p>

        <div className="flex justify-center gap-6 mt-6 text-gray-700 dark:text-gray-300">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} Monizey. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
