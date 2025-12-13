import React from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import heroImg from "../assets/images/Dashboard.jpeg";
import { FaPlay } from "react-icons/fa";

const companies = [
  "Spotify", "Coinbase", "Slack", "Dropbox", "Zoom", "Webflow",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">

      {/* NAVBAR */}
      <PublicNavbar />

      {/* ORANGE GLOW BG */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[900px] h-[500px]
                      rounded-full bg-orange-600 opacity-20 blur-[150px]"></div>

      {/* HERO SECTION */}
      <section className="text-center mt-32">
        
        <div className="text-orange-500 font-medium text-sm tracking-wider">
          Manage Your Finances
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mt-4 leading-tight">
          Finance That Grows with <br /> Your Ambition
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto text-lg">
          Smart, powerful tools to manage, track, and grow your financial
          journey with confidence.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <button className="px-7 py-3 bg-orange-600 rounded-xl font-semibold text-white">
            Get Started
          </button>

          <button className="px-7 py-3 bg-white/5 backdrop-blur-xl rounded-xl text-white flex items-center gap-2 border border-white/10">
            <FaPlay className="text-sm" /> View Demo
          </button>
        </div>
      </section>

      {/* SEMICIRCLE & DASHBOARD */}
      <div className="relative flex justify-center mt-24">
        <div className="absolute bg-gradient-to-t from-orange-600/70 to-transparent
                        top-[-120px] w-[600px] h-[400px] rounded-t-full blur-[80px] opacity-60">
        </div>

        <div className="w-[80%] rounded-3xl bg-[#111] border border-white/10 shadow-2xl p-6 relative z-10">
          <img
            src={heroImg}
            alt="Dashboard Preview"
            className="rounded-2xl w-full"
          />
        </div>
      </div>

      {/* TRUSTED SECTION */}
      <section className="mt-20 text-center pb-20">
        <h2 className="text-xl text-gray-300">
          Trusted by <span className="text-white font-semibold">4,000+ Growing Companies</span>
        </h2>

        <div className="overflow-hidden mt-8">
          <div className="flex gap-20 animate-scroll whitespace-nowrap text-gray-400">
            {companies.map((c, idx) => (
              <span key={idx} className="text-lg opacity-70 hover:opacity-100 transition">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
