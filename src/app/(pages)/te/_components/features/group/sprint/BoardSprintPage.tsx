"use client";

import React, { useState } from "react";
import { Plus, Zap } from "lucide-react";
import type { Sprint, SprintFormData } from "./sprintTypes";
import { INITIAL_SPRINTS } from "./mockSprints";
import SprintCard from "./components/SprintCard";
import { Button } from "@/components/ui";
import CreateEditSprintDialog from "./container/CreateEditSprintDialog";
import GenerateSprintWithAIDialog from "./container/GenerateSprintWithAIDialog";
import CompleteSprintDialog from "./container/CompleteSprintDialog";
import CancelSprintDialog from "./container/CancelSprintDialog";
import DeleteSprintDialog from "./container/DeleteSprintDialog";

export default function BoardSprintPage() {
  const [sprints, setSprints] = useState<Sprint[]>(INITIAL_SPRINTS);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Sprint | null>(null);

  const [completeTarget, setCompleteTarget] = useState<Sprint | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Sprint | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sprint | null>(null);

  const [aiOpen, setAiOpen] = useState(false);

  const handleCreate = (data: SprintFormData) => {
    const newSprint: Sprint = {
      id: Date.now().toString(),
      ...data,
      status: "Draft",
      progress: 0,
    };

    setSprints((prev) => [...prev, newSprint]);
    setCreateOpen(false);
  };

  const toFormData = (s: Sprint): SprintFormData => ({
    name: s.name,
    startDate: s.startDate,
    endDate: s.endDate,
  });

  const handleEdit = (data: SprintFormData) => {
    if (!editTarget) return;

    setSprints((prev) =>
      prev.map((s) => (s.id === editTarget.id ? { ...s, ...data } : s)),
    );
    setEditTarget(null);
  };

  const handleComplete = (sprintId: string) => {
    setSprints((prev) =>
      prev.map((s) =>
        s.id === sprintId ? { ...s, status: "Completed", progress: 100 } : s,
      ),
    );
    setCompleteTarget(null);
  };

  const handleCancel = (sprintId: string) => {
    setSprints((prev) =>
      prev.map((s) =>
        s.id === sprintId ? { ...s, status: "Cancelled", progress: 0 } : s,
      ),
    );
    setCancelTarget(null);
  };

  const handleDelete = (sprintId: string) => {
    setSprints((prev) => prev.filter((s) => s.id !== sprintId));
    setDeleteTarget(null);
  };

  return (
    <div className="px-6 py-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-2xl font-semibold text-white">Sprints</div>
          <p className="text-sm text-gray-500 mt-0.5">
            Quản lý và theo dõi sprint của nhóm bạn
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => setAiOpen(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold
              bg-[#1E2A3A] text-gray-300 hover:bg-[#1E2A3A]/70 active:scale-95
              border border-[#1E2A3A] shadow-md shadow-black/10 transition-all duration-150"
          >
            <Zap size={15} className="text-[#F8AF18]" />
            Tạo Sprint với AI
          </Button>

          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold
              bg-[#1565C0] text-white hover:bg-[#1976D2] active:scale-95
              shadow-md shadow-[#1565C0]/30 transition-all duration-150"
          >
            <Plus size={15} />
            Tạo Sprint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sprints.map((sprint) => (
          <SprintCard
            key={sprint.id}
            sprint={sprint}
            onEdit={() => setEditTarget(sprint)}
            onComplete={() => setCompleteTarget(sprint)}
            onCancel={() => setCancelTarget(sprint)}
            onDelete={() => setDeleteTarget(sprint)}
          />
        ))}

        {sprints.length === 0 && (
          <div className="py-16 text-center text-gray-600 text-sm lg:col-span-2">
            Chưa có sprint nào. Hãy tạo sprint đầu tiên để bắt đầu.
          </div>
        )}
      </div>

      <CreateEditSprintDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onConfirm={handleCreate}
      />

      {editTarget && (
        <CreateEditSprintDialog
          open={!!editTarget}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null);
          }}
          mode="edit"
          initialData={toFormData(editTarget)}
          onConfirm={handleEdit}
        />
      )}

      <GenerateSprintWithAIDialog open={aiOpen} onOpenChange={setAiOpen} />

      <CompleteSprintDialog
        target={completeTarget}
        onOpenChange={(open) => {
          if (!open) setCompleteTarget(null);
        }}
        onConfirm={handleComplete}
      />

      <CancelSprintDialog
        target={cancelTarget}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        onConfirm={handleCancel}
      />

      <DeleteSprintDialog
        target={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

