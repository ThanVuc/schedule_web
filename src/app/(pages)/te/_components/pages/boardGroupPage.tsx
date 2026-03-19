'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Users, Plus } from "lucide-react";
import { CreateGroupDialog, DeleteGroupDialog, EditGroupDialog, Group, GroupCard, LeaveGroupDialog } from "../features/group";


const MOCK_GROUPS: Group[] = [
    { id: "1", name: "Product Team", updatedAt: "2 hours ago", memberCount: 8, role: "Owner" },
    { id: "2", name: "Engineering", updatedAt: "1 day ago", memberCount: 12, role: "Manager" },
    { id: "3", name: "Design System", updatedAt: "3 days ago", memberCount: 5, role: "Member" },
    { id: "4", name: "Marketing", updatedAt: "Yesterday", memberCount: 6, role: "Viewer" },
];


export default function BoardGroupPage() {
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search] = useState("");

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Group | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
    const [leaveTarget, setLeaveTarget] = useState<Group | null>(null);

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

    const handleCreate = (name: string) => {
        setGroups((prev) => [{
            id: String(Date.now()),
            name,
            updatedAt: "Just now",
            memberCount: 1,
            role: "Owner",
        }, ...prev]);
        setCreateOpen(false);
    };

    const handleEdit = (id: string, name: string) => {
        setGroups((prev) =>
            prev.map((g) => g.id === id ? { ...g, name, updatedAt: "Just now" } : g),
        );
        setEditTarget(null);
    };

    const handleDelete = (id: string) => {
        setGroups((prev) => prev.filter((g) => g.id !== id));
        setDeleteTarget(null);
    };

    const handleLeave = (id: string) => {
        setGroups((prev) => prev.filter((g) => g.id !== id));
        setLeaveTarget(null);
    };

    const openEdit = (id: string) => { const g = groups.find((g) => g.id === id); if (g) setEditTarget(g); };
    const openDelete = (id: string) => { const g = groups.find((g) => g.id === id); if (g) setDeleteTarget(g); };
    const openLeave = (id: string) => { const g = groups.find((g) => g.id === id); if (g) setLeaveTarget(g); };

    const handleCardClick = (id: string) => {
        setSelectedId(id);
        router.push(`/te/group/${id}/members`);
    };

    const filtered = groups.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));

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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b px-4">
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