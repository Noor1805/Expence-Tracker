import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="relative z-10 text-center max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative inline-block"
        >
          <h1 className="text-[100px] sm:text-[150px] md:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-red-600 leading-none select-none drop-shadow-[0_10px_30px_rgba(234,88,12,0.3)]">
            404
          </h1>

          <motion.div
            animate={{ y: [0, -25, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 sm:top-4 sm:right-4 text-5xl sm:text-7xl md:text-9xl drop-shadow-[0_0_25px_rgba(234,88,12,0.5)] grayscale-[0.5] hover:grayscale-0 transition-all duration-500"
          >
            ☄️
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6 tracking-wide uppercase"
        >
          Out of Orbit
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-base sm:text-lg mb-12 max-w-md mx-auto leading-relaxed border-l-2 border-orange-500 pl-4 text-left"
        >
          The signal was lost. This page has drifted into the dark sector.
          Re-align your trajectory to return to the dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-4 sm:py-3 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:text-white transition-all backdrop-blur-md active:scale-95"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto relative px-8 py-4 sm:py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-black font-bold shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:scale-105 transition-all active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Return Home</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full hover:translate-x-full transition-transform duration-700" />
          </button>
        </motion.div>
      </div>

      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-orange-500/80 rounded-full blur-[1px]"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            opacity: 0,
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
