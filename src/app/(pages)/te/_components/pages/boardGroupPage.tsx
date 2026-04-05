'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui";
import { useAxios, useAxiosMutation, useToastState } from "@/hooks";
import { Users, Plus } from "lucide-react";
import { teamGroupApiUrl } from "@/api/teamGroup";
import {
    CreateGroupDialog,
    DeleteGroupDialog,
    EditGroupDialog,
    GroupCard,
    LeaveGroupDialog,
} from "../features/group";
import { type Group } from "../features/group/types";

type GroupApiModel = {
    id?: string;
    group_id?: string;
    name?: string;
    group_name?: string;
    description?: string | null;
    member_count?: number;
    members_count?: number;
    role?: Group["role"] | string | { name?: string } | null;
    my_role?: string | { name?: string } | null;
    created_at?: string;
    updated_at?: string;
    updatedAt?: string;
    member_total?: number;
    avatar_url?: string;
    active_sprint?: string | null;
};

export default function BoardGroupPage() {
    const router = useRouter();
    const { setToast } = useToastState();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search] = useState("");

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Group | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
    const [leaveTarget, setLeaveTarget] = useState<Group | null>(null);

    const { data: groupData, loading, refetch } = useAxios<GroupApiModel[] | { items?: GroupApiModel[] }>({
        method: "GET",
        url: teamGroupApiUrl.list,
    });

    const { sendRequest: createGroupRequest } = useAxiosMutation({
        method: "POST",
        url: teamGroupApiUrl.create,
    });
    const { sendRequest: updateGroupRequest } = useAxiosMutation({
        method: "PATCH",
        url: teamGroupApiUrl.list,
    });
    const { sendRequest: deleteGroupRequest } = useAxiosMutation({
        method: "DELETE",
        url: teamGroupApiUrl.list,
    });

    useEffect(() => {
        const id = "group-board-keyframes";
        if (document.getElementById(id)) return;
        const style = document.createElement("style");
        style.id = id;
        style.textContent = `
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
        document.head.appendChild(style);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    const normalizeRole = (role?: GroupApiModel["role"]): Group["role"] => {
        const roleText = (() => {
            if (typeof role === "string" || typeof role === "number") return String(role);
            if (role && typeof role === "object") {
                if ("name" in role && typeof role.name === "string") return role.name;
                if ("value" in role && typeof (role as { value?: unknown }).value === "string") return (role as { value: string }).value;
                if ("id" in role && (typeof (role as { id?: unknown }).id === "string" || typeof (role as { id?: unknown }).id === "number")) {
                    return String((role as { id: string | number }).id);
                }
            }
            return "";
        })();

        const normalized = String(roleText ?? "").trim().toLowerCase();

        if (normalized === "owner") return "Owner";
        if (normalized === "manager") return "Manager";
        if (normalized === "member") return "Member";
        if (normalized === "viewer") return "Viewer";
        if (normalized === "1") return "Owner";
        if (normalized === "2") return "Manager";
        if (normalized === "3") return "Member";
        if (normalized === "4") return "Viewer";

        if (roleText === "Owner" || roleText === "Manager" || roleText === "Member" || roleText === "Viewer") {
            return roleText;
        }

        return "Member";
    };

    const groupsFromApi = Array.isArray(groupData)
        ? groupData
        : (groupData?.items ?? []);

    const groups: Group[] = groupsFromApi.map((item) => {
        // Prefer group_id (actual Group UUID required by members/sprints APIs) over id
        // which may be a GroupMember record ID depending on backend implementation.
        const primaryId = (item.group_id ?? "").trim() || (item.id ?? "").trim();
        const secondaryId = (item.id ?? "").trim();
        const altGroupId = primaryId && secondaryId && primaryId !== secondaryId ? secondaryId : undefined;
        return {
            id: primaryId,
            altGroupId,
            name: item.name ?? item.group_name ?? "Untitled group",
            description: item.description,
            createdAt: item.created_at ? format(new Date(item.created_at), "dd/MM/yyyy HH:mm") : "N/A",
            updatedAt: item.updated_at ? format(new Date(item.updated_at), "dd/MM/yyyy HH:mm") : item.updatedAt ? format(new Date(item.updatedAt), "dd/MM/yyyy HH:mm") : "N/A",
            memberCount: item.member_total ?? item.member_count ?? item.members_count ?? 0,
            role: normalizeRole(item.my_role ?? item.role),
            avatarUrl: item.avatar_url,
            activeSprint: item.active_sprint,
        }
    }).filter((item) => item.id);

    const handleCreate = async (payload: { name: string; description?: string }) => {
        const result = await createGroupRequest(payload);

        if (result.error) {
            const detail = (result.error.response?.data as { detail?: string } | undefined)?.detail;
            setToast({
                title: "Tạo nhóm thất bại",
                message: detail || "Không thể tạo nhóm, vui lòng thử lại.",
                variant: "error",
            });
            return;
        }
        refetch?.();
        setCreateOpen(false);
    };

    const handleEdit = async (id: string, payload: { name?: string; description?: string }) => {
        const updatePayload: { name?: string; description?: string } = {};
        if (payload.name && payload.name.trim()) {
            updatePayload.name = payload.name.trim();
        }
        if (payload.description !== undefined) {
            updatePayload.description = payload.description;
        }
        if (!updatePayload.name && updatePayload.description === undefined) {
            setToast({ title: "Cập nhật thất bại", message: "Vui lòng nhập ít nhất 1 trường cần cập nhật.", variant: "warning" });
            return;
        }

        let result = await updateGroupRequest(updatePayload, id);
        const fallbackId = editTarget?.altGroupId;
        const status = result.error?.response?.status;
        if (result.error && fallbackId && fallbackId !== id && (status === 404 || status === 422)) {
            result = await updateGroupRequest(updatePayload, fallbackId);
        }
        if (result.error) {
            setToast({ title: "Cập nhật thất bại", message: "Không thể cập nhật nhóm.", variant: "error" });
            return;
        }
        refetch?.();
        setEditTarget(null);
    };

    const handleDelete = async (id: string) => {
        let result = await deleteGroupRequest(undefined, id);
        const fallbackId = deleteTarget?.altGroupId;
        const status = result.error?.response?.status;
        if (result.error && fallbackId && fallbackId !== id && (status === 404 || status === 422)) {
            result = await deleteGroupRequest(undefined, fallbackId);
        }
        if (result.error) {
            setToast({ title: "Xóa nhóm thất bại", message: "Không thể xóa nhóm.", variant: "error" });
            return;
        }
        refetch?.();
        setDeleteTarget(null);
    };

    const handleLeave = async (id: string) => {
        void id;
        setToast({
            title: "error",
            message: "",
            variant: "warning",
        });
        setLeaveTarget(null);
    };

    const openEdit = (id: string) => { const g = groups.find((g) => g.id === id); if (g) setEditTarget(g); };
    const openDelete = (id: string) => { const g = groups.find((g) => g.id === id); if (g) setDeleteTarget(g); };
    const openLeave = (id: string) => { const g = groups.find((g) => g.id === id); if (g) setLeaveTarget(g); };

    const handleCardClick = (id: string) => {
        const group = groups.find((g) => g.id === id);
        setSelectedId(id);
        const params = new URLSearchParams({
            tab: "members",
            groupName: group?.name ?? "",
            memberCount: String(group?.memberCount ?? 0),
        });
        if (group?.altGroupId) {
            params.set("altGroupId", group.altGroupId);
        }
        router.push(`/te/group/${id}?${params.toString()}`);
    };

    const filtered = groups.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="min-h-full bg-[#0B1120]">

            <CreateGroupDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onConfirm={handleCreate}
            />
            <EditGroupDialog
                target={editTarget}
                onOpenChange={(o) => { if (!o) setEditTarget(null); }}
                onConfirm={handleEdit}
            />
            <DeleteGroupDialog
                target={deleteTarget}
                onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
                onConfirm={handleDelete}
            />
            <LeaveGroupDialog
                target={leaveTarget}
                onOpenChange={(o) => { if (!o) setLeaveTarget(null); }}
                onConfirm={handleLeave}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-[#1E2A3A] px-4">
                <div className="py-8 px-4">
                    <h1 className="text-3xl font-bold text-white leading-tight">Nhóm của bạn</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Quản lý và cộng tác cùng các nhóm của bạn.{" "}
                        <span className="text-gray-400">Bạn có {groups.length} nhóm.</span>
                    </p>
                </div>
                <Button
                    onClick={() => setCreateOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-[#1565C0] px-3 py-2 text-sm
                               text-white hover:bg-[#1976D2] active:scale-95 shadow-md shadow-[#1565C0]/25"
                >
                    <Plus size={15} /> Tạo nhóm mới
                </Button>
            </div>

            {loading && (
                <div className="px-8 text-sm text-gray-500">Đang tải danh sách nhóm...</div>
            )}

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1E2A3A]">
                        <Users size={24} className="text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm">
                        {search ? `Không tìm thấy nhóm "${search}"` : "Bạn chưa có nhóm nào."}
                    </p>
                    {!search && (
                        <Button
                            className="mt-1 text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4"
                            onClick={() => setCreateOpen(true)}
                        >
                            Tạo nhóm đầu tiên của bạn
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 px-7">
                    {filtered.map((group, i) => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            isSelected={selectedId === group.id}
                            onClick={handleCardClick}
                            onEdit={openEdit}
                            onDelete={openDelete}
                            onLeave={openLeave}
                            style={{
                                animationName: "fadeSlideUp",
                                animationDuration: "0.35s",
                                animationTimingFunction: "ease-out",
                                animationFillMode: "both",
                                animationDelay: `${i * 60}ms`,
                                background: "#1A2332",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}