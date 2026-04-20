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
import api from "@/lib/axiosInstance";
import { useToastState } from "@/hooks/useToasts";

export default function BoardSprintPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const groupId = params?.id ?? "";
  const altGroupId = (searchParams.get("altGroupId") ?? "").trim();
  const [activeGroupId, setActiveGroupId] = useState(groupId);
  const { setToast } = useToastState();
  const [exportingSprintId, setExportingSprintId] = useState<string | null>(null);

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
    if (!status) return "Draft";

    if (status === "Draft") return "Draft";
    if (status === "Active") return "Active";
    if (status === "Completed") return "Completed";
    if (status === "Cancelled") return "Cancelled";

    const asStr = String(status).trim();
    if (asStr === "1") return "Draft";
    if (asStr === "2") return "Active";
    if (asStr === "3") return "Completed";
    if (asStr === "4") return "Cancelled";

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
      progress: item.progress_percent ?? item.progress ?? 0,
    };
  }).filter((item) => item.id);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Sprint | null>(null);

  const [activateTarget, setActivateTarget] = useState<Sprint | null>(null);
  const [completeTarget, setCompleteTarget] = useState<Sprint | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Sprint | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sprint | null>(null);
  const [deleteMode, setDeleteMode] = useState<"sprintOnly" | "sprintAndWorks">("sprintOnly");

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

  const openWorkboardForSprint = (sprint: Sprint) => {
    if (!activeGroupId || !sprint.id) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", "workboard");
    next.set("sprint_id", sprint.id);
    next.delete("mode");
    next.delete("id");
    router.push(`/te/group/${activeGroupId}?${next.toString()}`, { scroll: false });
  };

  const parseFilenameFromContentDisposition = (cd: unknown): string | null => {
    if (typeof cd !== "string") return null;
    const raw = cd.trim();
    const matchStar = raw.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
    if (matchStar?.[1]) {
      try {
        return decodeURIComponent(matchStar[1].replace(/^["']|["']$/g, ""));
      } catch {
        return matchStar[1].replace(/^["']|["']$/g, "");
      }
    }
    const match = raw.match(/filename\s*=\s*([^;]+)/i);
    if (!match?.[1]) return null;
    return match[1].trim().replace(/^["']|["']$/g, "");
  };

  const handleExportSprint = async (sprint: Sprint) => {
    if (!activeGroupId || !sprint?.id) return;
    if (exportingSprintId) return;

    setExportingSprintId(sprint.id);
    try {
      const res = await api.get(teamSprintApiUrl.export(activeGroupId, sprint.id), {
        responseType: "blob",
      });

      const filename =
        parseFilenameFromContentDisposition(res.headers?.["content-disposition"]) ??
        `sprint_${sprint.id}.xlsx`;

      const blob = res.data as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setToast({
        title: "Xuất sprint thất bại",
        message: "Không thể xuất sprint. Vui lòng thử lại.",
        variant: "error",
      });
      return;
    } finally {
      setExportingSprintId(null);
    }
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
            onOpenWorkboard={() => openWorkboardForSprint(sprint)}
            onEdit={() => setEditTarget(sprint)}
            onExport={() => handleExportSprint(sprint)}
            onActivate={() => setActivateTarget(sprint)}
            onComplete={() => setCompleteTarget(sprint)}
            onCancel={() => setCancelTarget(sprint)}
            onDeleteSprintOnly={() => {
              setDeleteMode("sprintOnly");
              setDeleteTarget(sprint);
            }}
            onDeleteSprintAndWorks={() => {
              setDeleteMode("sprintAndWorks");
              setDeleteTarget(sprint);
            }}
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
        mode={deleteMode}
        onSuccess={() => refetch?.()}
      />
    </div>
  );
}