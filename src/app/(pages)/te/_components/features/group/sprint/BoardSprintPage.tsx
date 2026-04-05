"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Plus, Zap } from "lucide-react";
import type { Sprint, SprintApiItem, SprintFormData, SprintListMetadata } from "./sprintTypes";
import SprintCard from "./components/SprintCard";
import { Button } from "@/components/ui";
import { useAxios } from "@/hooks/useAxios";
import { teamSprintApiUrl } from "@/api/teamGroup";
import CreateEditSprintDialog from "./container/CreateEditSprintDialog";
import GenerateSprintWithAIDialog from "./container/GenerateSprintWithAIDialog";
import ActivateSprintDialog from "./container/ActivateSprintDialog";
import CompleteSprintDialog from "./container/CompleteSprintDialog";
import CancelSprintDialog from "./container/CancelSprintDialog";
import DeleteSprintDialog from "./container/DeleteSprintDialog";

export default function BoardSprintPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const groupId = params?.id ?? "";
  const altGroupId = (searchParams.get("altGroupId") ?? "").trim();
  const [activeGroupId, setActiveGroupId] = useState(groupId);

  useEffect(() => {
    setActiveGroupId(groupId);
  }, [groupId]);

  const { data: sprintData, loading, refetch, error: sprintListError } = useAxios<SprintListMetadata>(
    {
      method: "GET",
      url: teamSprintApiUrl.list(activeGroupId),
    },
    [activeGroupId],
    !activeGroupId,
  );

  const normalizeStatus = (status?: SprintApiItem["status"]): Sprint["status"] => {
    const statusText = (() => {
      if (typeof status === "string" || typeof status === "number") return String(status);
      if (status && typeof status === "object") {
        if ("name" in status && typeof status.name === "string") return status.name;
        if ("value" in status && typeof status.value === "string") return status.value;
        if ("id" in status && (typeof status.id === "string" || typeof status.id === "number")) return String(status.id);
      }
      return "";
    })();

    const normalized = statusText.trim().toLowerCase();
    if (normalized === "active") return "Active";
    if (normalized === "completed") return "Completed";
    if (normalized === "cancelled") return "Cancelled";
    if (normalized === "1") return "Draft";
    if (normalized === "2") return "Active";
    if (normalized === "3") return "Completed";
    if (normalized === "4") return "Cancelled";
    return "Draft";
  };

  const sprintsFromApi = (() => {
    const raw = sprintData;
    if (!raw) return [] as SprintApiItem[];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw.items)) return raw.items;
    if (Array.isArray(raw.sprints)) return raw.sprints;
    if (Array.isArray(raw.data)) return raw.data;
    if (raw.data && !Array.isArray(raw.data) && Array.isArray(raw.data.items)) return raw.data.items;
    if (raw.result && Array.isArray(raw.result.items)) return raw.result.items;
    return [] as SprintApiItem[];
  })();
  const sprints: Sprint[] = sprintsFromApi.map((item) => {
    const primaryId = (item.id ?? "").trim() || (item.sprint_id ?? "").trim();
    const secondaryId = (item.sprint_id ?? "").trim();
    const altSprintId = primaryId && secondaryId && primaryId !== secondaryId ? secondaryId : undefined;
    return {
      id: primaryId,
      altSprintId,
      name: item.name ?? item.title ?? "Untitled sprint",
      goal: item.goal ?? "",
      startDate: item.start_date ?? item.startDate ?? "",
      endDate: item.end_date ?? item.endDate ?? "",
      status: normalizeStatus(item.status),
      progress: item.progress ?? 0,
    };
  }).filter((item) => item.id);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Sprint | null>(null);

  const [activateTarget, setActivateTarget] = useState<Sprint | null>(null);
  const [completeTarget, setCompleteTarget] = useState<Sprint | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Sprint | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sprint | null>(null);

  const [aiOpen, setAiOpen] = useState(false);
  const isForbidden = sprintListError?.response?.status === 422;

  useEffect(() => {
    if (!isForbidden || !altGroupId || activeGroupId === altGroupId) return;
    setActiveGroupId(altGroupId);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("altGroupId");
    router.replace(`/te/group/${altGroupId}?${next.toString()}`, { scroll: false });
  }, [activeGroupId, altGroupId, isForbidden, router, searchParams]);

  const toFormData = (s: Sprint): SprintFormData => ({
    name: s.name,
    goal: s.goal,
    startDate: s.startDate,
    endDate: s.endDate,
  });

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
        {loading && (
          <div className="py-3 text-sm text-gray-500 lg:col-span-2">
            Đang tải danh sách sprint...
          </div>
        )}
        {isForbidden && (
          <div className="px-4 py-3 text-sm text-amber-300 border border-[#1E2A3A] rounded-md bg-amber-500/10 lg:col-span-2">
            Bạn không phải thành viên của group này nên không thể xem danh sách sprint.
          </div>
        )}
        {sprints.map((sprint) => (
          <SprintCard
            key={sprint.id}
            sprint={sprint}
            onEdit={() => setEditTarget(sprint)}
            onActivate={() => setActivateTarget(sprint)}
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
        groupId={activeGroupId}
        onSuccess={() => refetch?.()}
      />

      {editTarget && (
        <CreateEditSprintDialog
          open={!!editTarget}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null);
          }}
          mode="edit"
          groupId={activeGroupId}
          editTarget={editTarget}
          initialData={toFormData(editTarget)}
          onSuccess={() => refetch?.()}
        />
      )}

      <GenerateSprintWithAIDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        groupId={activeGroupId}
        onSuccess={() => refetch?.()}
      />

      <ActivateSprintDialog
        target={activateTarget}
        onOpenChange={(open) => {
          if (!open) setActivateTarget(null);
        }}
        groupId={activeGroupId}
        onSuccess={() => refetch?.()}
      />

      <CompleteSprintDialog
        target={completeTarget}
        onOpenChange={(open) => {
          if (!open) setCompleteTarget(null);
        }}
        groupId={activeGroupId}
        onSuccess={() => refetch?.()}
      />

      <CancelSprintDialog
        target={cancelTarget}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        groupId={activeGroupId}
        onSuccess={() => refetch?.()}
      />

      <DeleteSprintDialog
        target={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        groupId={activeGroupId}
        onSuccess={() => refetch?.()}
      />
    </div>
  );
}
