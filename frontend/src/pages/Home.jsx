import React from "react";
import LightRays from "../components/layout/effects/LightRays";
import PublicNavbar from "../components/layout/PublicNavbar";
import heroImg from "../assets/images/Dashboard.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      <PublicNavbar />

      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[90vh] pointer-events-none z-10">
          <div className="relative w-full max-w-7xl mx-auto h-full">
            <div
              className="
  absolute top-0
  hidden md:block
  right-[8%] md:right-[2%]
  w-full h-[1100px]
"
            >
              <LightRays
                raysOrigin="top-right"
                raysSpeed={0.55}
                flowStrength={0.08}
                fogFallSpeed={1}
                flowSpeed={1}
                horizontalBeamOffset={0.15}
                horizontalSizing={1.2}
                verticalSizing={1.1}
                rayLength={4.2}
                pulsating
                fadeDistance={0.5}
                saturation={1.35}
                followMouse
                mouseInfluence={0.025}
                noiseAmount={0.02}
                distortion={0.05}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="text-center mt-28 relative z-20 max-w-3xl mx-auto px-4">
        <div className="inline-block px-6 py-2 rounded-full text-sm tracking-wide font-medium text-orange-300 border border-orange-400/30 bg-black/30 backdrop-blur-xl shadow-[0_0_12px_rgba(255,122,0,0.25)]">
          Track • Control • Grow
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-snug">
          Smarter Money Management
          <br /> with <span className="text-orange-500">Monexa</span>
        </h1>

        <p className="text-gray-400 mt-4 text-lg md:text-xl leading-relaxed">
          Monexa simplifies how you track expenses, build budgets, and
          understand your financial habits — all with stunning visual insights
          that help you grow.
        </p>

        <div className="flex justify-center gap-4 sm:gap-6 mt-8 flex-wrap">
          <button className="px-10 py-3.5 text-lg font-semibold rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 text-white shadow-[0_0_25px_rgba(255,120,0,0.45)] transition-all duration-300">
            Get Started
          </button>

          <button className="px-10 py-3.5 text-lg font-medium rounded-full text-gray-300 bg-black/40 border border-white/15 backdrop-blur-xl transition-all duration-300">
            Watch Demo
          </button>
        </div>
      </section>

      <div className="relative w-full flex justify-center mt-24 mb-10 px-4 z-20">
        <div className="relative w-full max-w-6xl rounded-3xl bg-[#0F0F0F] border border-orange-500/20 p-4 sm:p-6 shadow-[0_0_80px_rgba(255,122,0,0.28),0_0_120px_rgba(255,122,0,0.18)]">
          <div className="absolute -inset-6 -z-10 rounded-[32px] bg-[radial-gradient(circle,_rgba(255,172,0,0.28),transparent_82%)] blur-[90px]" />

          <img
            src={heroImg}
            alt="Dashboard Preview"
            className="rounded-2xl w-full shadow-[0_0_45px_rgba(0,0,0,0.7)]"
          />
        </div>
      </div>
    </div>
  );
}
