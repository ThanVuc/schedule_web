"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Sprint } from "../sprintTypes";
import SprintActionsMenu from "./SprintActionsMenu";
import SprintProgressBar from "./SprintProgressBar";
import SprintStatusBadge from "./SprintStatusBadge";
import { toDdMmYyyy } from "@/app/(pages)/te/_utils/date";

export default function SprintCard({
  sprint,
  onOpenWorkboard,
  onEdit,
  onExport,
  onActivate,
  onComplete,
  onCancel,
  onDeleteSprintOnly,
  onDeleteSprintAndWorks,
}: {
  sprint: Sprint;
  onOpenWorkboard?: () => void;
  onEdit: () => void;
  onExport: () => void;
  onActivate: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onDeleteSprintOnly: () => void;
  onDeleteSprintAndWorks: () => void;
}) {
  return (
    <div className="rounded-md border border-[#1E2A3A] bg-[#1A2332] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {onOpenWorkboard ? (
            <div
              onClick={() => onOpenWorkboard()}
              className={cn(
                "bg-transparent text-md font-semibold truncate max-w-full text-left w-full min-w-0",
                " hover:text-[#64B5F6] ",
                "cursor-pointer transition-colors rounded-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565C0]/50",
              )}
            >
              {sprint.name}
            </div>
          ) : (
            <div className="text-md font-semibold text-white truncate">
              {sprint.name}
            </div>
          )}
          <div className="mt-2 flex items-center gap-3">
            <SprintStatusBadge status={sprint.status} />
          </div>
          <div className="mt-1 py-1 text-sm text-gray-500">
            {toDdMmYyyy(sprint.startDate)} - {toDdMmYyyy(sprint.endDate)}
          </div>
        </div>

        <SprintActionsMenu
          sprint={sprint}
          onEdit={onEdit}
          onExport={onExport}
          onActivate={onActivate}
          onComplete={onComplete}
          onCancel={onCancel}
          onDeleteSprintOnly={onDeleteSprintOnly}
          onDeleteSprintAndWorks={onDeleteSprintAndWorks}
        />
      </div>

      <SprintProgressBar progress={sprint.progress} />
    </div>
  );
}

