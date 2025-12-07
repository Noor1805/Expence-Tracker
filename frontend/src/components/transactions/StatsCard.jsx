// src/components/transactions/StatsCard.jsx
import React from "react";

export default function StatsCard({ title, value, accent = "text-blue-400" }) {
  return (
    <div
      className={`glass neo rounded-2xl p-5 flex flex-col`}
      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="text-xs text-gray-300">{title}</span>
      <span className={`text-2xl md:text-3xl font-semibold mt-2 ${accent}`}>
        {value}
      </span>
    </div>
  );
}

