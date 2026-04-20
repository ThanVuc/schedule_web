"use client";

import React from "react";

export default function SprintProgressBar({
  progress,
}: {
  progress: number;
}) {
  const safe = Math.max(0, Math.min(100, progress));
  const display = Number.isInteger(safe)
    ? `${safe}.00`
    : safe.toFixed(2);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>Tiến độ</span>
        <span className="text-gray-400">{display}%</span>
      </div>
      <div className="h-2.5 bg-[#1565C0]/30 rounded-full overflow-hidden border border-[#1E2A3A]">
        <div
          className="h-full bg-[#2A97EA]"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}