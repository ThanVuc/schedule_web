"use client";

import React from "react";
import type { Sprint } from "../sprintTypes";
import SprintActionsMenu from "./SprintActionsMenu";
import SprintProgressBar from "./SprintProgressBar";
import SprintStatusBadge from "./SprintStatusBadge";

export default function SprintCard({
  sprint,
  onEdit,
  onComplete,
  onCancel,
  onDelete,
}: {
  sprint: Sprint;
  onEdit: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-md border border-[#1E2A3A] bg-[#1A2332] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-md font-semibold text-white truncate">
            {sprint.name}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <SprintStatusBadge status={sprint.status} />
          </div>
          <div className="mt-1 py-1 text-sm text-gray-500">
            {sprint.startDate} - {sprint.endDate}
          </div>
        </div>

        <SprintActionsMenu
          sprint={sprint}
          onEdit={onEdit}
          onComplete={onComplete}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </div>

      <SprintProgressBar progress={sprint.progress} />
    </div>
  );
}

