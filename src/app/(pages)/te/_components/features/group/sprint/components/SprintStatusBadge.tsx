"use client";

import React from "react";
import type { SprintStatus } from "../sprintTypes";

const STATUS_STYLE: Record<SprintStatus, string> = {
  Draft: "bg-[#2A3A4F] text-slate-400 border-slate-500/30",
  Active: "bg-[#2A97EA] text-white border-emerald-500/30",
  Completed: "bg-[#F8AF18] text-black border-gray-500/30",
  Cancelled: "bg- text-red-400 border-red-500/30",
};


export default function SprintStatusBadge({ status }: { status: SprintStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-md
      text-xs font-medium border ${STATUS_STYLE[status]}`}
    >
      {status}
    </span>
  );
}

