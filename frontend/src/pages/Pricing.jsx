import React from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    features: [
      "Up to 50 transactions",
      "Basic tracking",
      "Monthly reports",
      "Community support",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹199",
    features: [
      "Unlimited transactions",
      "Advanced analytics",
      "Budget alerts",
      "CSV / Excel export",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "₹399",
    features: [
      "Everything in Pro",
      "Recurring payments",
      "Cloud backup",
      "Priority support",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative min-h-screen bg-[#050505] overflow-hidden flex items-center justify-center"
    >
      <h1
        className="
          absolute top-2 md:top-[-20px] lg:top-2 xl:top-6
          text-[100px] md:text-[220px]
          font-bold tracking-tight
          text-orange-500
          select-none audiowide-regular
        "
      >
        Pricing
      </h1>

      <div className="relative z-10 mt-40 grid grid-cols-1 md:grid-cols-3 gap-10 px-6 max-w-6xl">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`
              relative rounded-[28px] p-8
              bg-black/10
              backdrop-blur-[3px]
              border border-white/65
              shadow-[0_40px_80px_rgba(0,0,0,0.85)]
              transition
              ${
                plan.highlight
                  ? "scale-105 border-orange-500/40"
                  : "hover:-translate-y-2"
              }
            `}
          >
            <div
              className="
                absolute top-0 left-0 right-0
                h-24
                rounded-t-[28px]
                bg-gradient-to-b
                from-orange-500/10
                to-transparent
                pointer-events-none
              "
            />

            <p className="text-sm text-gray-400">Plan</p>
            <h3 className="text-3xl audiowide-regular font-semibold text-white">
              {plan.name}
            </h3>

            <div className="mt-4 text-5xl font-bold text-white">
              {plan.price}
              <span className="text-base text-gray-400"> / mo</span>
            </div>

            <ul className="mt-8 space-y-4">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <Check size={18} className="text-orange-500 mt-1" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              className={`
                mt-10 w-full py-3 rounded-xl font-semibold
                ${
                  plan.highlight
                    ? "bg-orange-500 text-black hover:bg-white/5 hover:text-orange-500"
                    : "bg-white/10 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
