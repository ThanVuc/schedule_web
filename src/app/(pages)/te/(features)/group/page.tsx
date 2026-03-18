'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage, Button, DialogClose, Input } from "@/components/ui";
import { Users, Plus, MoreVertical, Pencil, Trash2, LogOut, Clock } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, SubmitConfirmModal
} from "../../_components/common/teamDialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type Role = "Owner" | "Manager" | "Member" | "Viewer";

interface Group {
  id: string;
  name: string;
  updatedAt: string;
  memberCount: number;
  role: Role;
  avatarUrl?: string;
  color?: string;
}

const MOCK_GROUPS: Group[] = [
  { id: "1", name: "Product Team", updatedAt: "2 hours ago", memberCount: 8, role: "Owner", color: "#1565C0" },
  { id: "2", name: "Engineering", updatedAt: "1 day ago", memberCount: 12, role: "Manager", color: "#0E7C61" },
  { id: "3", name: "Design System", updatedAt: "3 days ago", memberCount: 5, role: "Member", color: "#6A3FB5" },
  { id: "4", name: "Marketing", updatedAt: "Yesterday", memberCount: 6, role: "Viewer", color: "#B5543F" },
];

const COLOR_PRESETS = [
  "#1565C0", "#0E7C61", "#6A3FB5", "#B5543F",
  "#C07D15", "#1A7A9C", "#A0365C", "#2E7D32",
];

const ROLE_STYLES: Record<Role, string> = {
  Owner: "bg-[#F8AF18] text-black",
  Manager: "bg-[#2A97EA] text-white",
  Member: "text-gray-300 border border-gray-500/25",
  Viewer: "bg-[#2A3A4F] text-gray-400 border border-gray-600/30",
};


const RoleBadge = ({ role }: { role: Role }) => (
  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold", ROLE_STYLES[role])}>
    {role}
  </span>
);

const GroupAvatar = ({ group }: { group: Group }) => {
  const initials = group.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Avatar className="w-11 h-11 shrink-0">
      <AvatarImage src={group.avatarUrl} alt={group.name} />
      <AvatarFallback
        className="text-white text-sm font-bold"
        style={{ background: `linear-gradient(135deg, ${group.color ?? "#1565C0"}cc, ${group.color ?? "#1565C0"}55)` }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};


const CardDropdown = ({
  groupId, role, onEdit, onDelete, onLeave,
}: {
  groupId: string;
  role: Role;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onLeave: (id: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
      <button
        className="flex items-center justify-center w-7 h-7 rounded-md text-gray-500
                   hover:bg-[#1E2A3A] hover:text-gray-300 transition-colors"
        aria-label="More options"
      >
        <MoreVertical size={15} />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      onClick={(e) => e.stopPropagation()}
      className="w-44 rounded-xl border border-[#1E2A3A] bg-[#111820] shadow-2xl shadow-black/60 py-1"
    >
      {(role === "Owner" || role === "Manager") && (
        <DropdownMenuItem
          onClick={() => onEdit(groupId)}
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300
                     hover:bg-[#1E2A3A] hover:text-white transition-colors cursor-pointer"
        >
          <Pencil size={14} className="text-blue-400" />
          Chỉnh sửa nhóm
        </DropdownMenuItem>
      )}

      {role === "Owner" && (
        <>
          <DropdownMenuSeparator className="bg-[#1E2A3A]" />
          <DropdownMenuItem
            onClick={() => onDelete(groupId)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-400
                       hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            Xóa Nhóm
          </DropdownMenuItem>
        </>
      )}

      {role !== "Owner" && (
        <DropdownMenuItem
          onClick={() => onLeave(groupId)}
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-orange-400
                     hover:bg-orange-500/10 hover:text-orange-300 transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          Rời nhóm
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);


const GroupCard = ({
  group, isSelected, onClick, onEdit, onDelete, onLeave, style,
}: {
  group: Group;
  isSelected: boolean;
  style?: React.CSSProperties;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onLeave: (id: string) => void;
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onClick(group.id)}
    onKeyDown={(e) => e.key === "Enter" && onClick(group.id)}
    style={style}
    className={cn(
      "group relative flex flex-col rounded-xl border-2 bg-[#0D1117] p-5 cursor-pointer",
      "transition-all duration-200 ease-out outline-none select-none",
      "hover:border-2 hover:border-blue-700",
      isSelected
        ? "border-[#1565C0] shadow-md shadow-[#1565C0]/15 ring-1 ring-[#1565C0]/30"
        : "border-[#1E2A3A] hover:border-[#1565C0]",
    )}
  >
    {isSelected && (
      <span className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r from-transparent via-[#1565C0] to-transparent" />
    )}

    <div className="flex items-start justify-between gap-2 mb-4">
      <GroupAvatar group={group} />
      <CardDropdown
        groupId={group.id}
        role={group.role}
        onEdit={onEdit}
        onDelete={onDelete}
        onLeave={onLeave}
      />
    </div>

    <h3 className="text-[15px] font-bold text-white leading-snug mb-1 group-hover:text-blue-100 transition-colors">
      {group.name}
    </h3>
    <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
      <Clock size={11} className="shrink-0" /> Updated {group.updatedAt}
    </p>

    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1E2A3A]">
      <span className="flex items-center gap-1.5 text-xs text-gray-400">
        <Users size={13} className="shrink-0 text-gray-500" />
        {group.memberCount} members
      </span>
      <RoleBadge role={group.role} />
    </div>
  </div>
);


export default function GroupPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupColor, setGroupColor] = useState(COLOR_PRESETS[0]);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

  const isDirty = groupName.trim() !== "" || groupDesc.trim() !== "";
  const isValid = groupName.trim().length > 0;

  useEffect(() => {
    if (createOpen) { setGroupName(""); setGroupDesc(""); setGroupColor(COLOR_PRESETS[0]); }
  }, [createOpen]);

  useEffect(() => {
    const id = "group-board-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0);    }
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  const doCreate = () => {
    setGroups((prev) => [{
      id: String(Date.now()),
      name: groupName.trim(),
      updatedAt: "Just now",
      memberCount: 1,
      role: "Owner",
      color: groupColor,
    }, ...prev]);
    setCreateOpen(false);
  };

  const filtered = groups.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
  const handleCardClick = (id: string) => { setSelectedId(id); router.push(`/te/group/${id}/members`); };
  const handleEdit = (id: string) => router.push(`/te/group/${id}/settings`);
  const handleDelete = (id: string) => setGroups((prev) => prev.filter((g) => g.id !== id));
  const handleLeave = (id: string) => setGroups((prev) => prev.filter((g) => g.id !== id));

  return (
    <div className="min-h-full bg-[#0B1120]">

      {showCreateConfirm && (
        <SubmitConfirmModal
          onConfirm={() => { setShowCreateConfirm(false); doCreate(); }}
          onCancel={() => setShowCreateConfirm(false)}
        />
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen} warnOnClose={isDirty}>
        <DialogContent
          size="md"
          className="bg-[#0B1120] border-[#1E2A3A] text-white p-0 overflow-hidden gap-0"
        >
          <div className="relative px-6 pt-6 pb-4 border-b border-[#1E2A3A]">
            <div className="absolute inset-x-0 top-0 h-[3px] transition-all duration-300" />
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Tạo nhóm mới</DialogTitle>
              <DialogDescription className="text-gray-500 text-sm">
                Nhóm giúp bạn tổ chức các thành viên và phối hợp làm việc hiệu quả hơn.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-5 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs text-gray-400 uppercase pb-2 ">
                  <span>Tên nhóm</span>
                </label>
                <Input
                  type="text"
                  placeholder="nhập tên nhóm của bạn"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  maxLength={50}
                  className="w-full rounded-lg border border-[#1E2A3A] bg-[#111820] px-3 py-2 text-sm
                             text-white placeholder:text-gray-600 focus:outline-none
                             focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]/40 transition-colors"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 sm:flex-row">
            <DialogClose asChild>
              <Button
                type="button"
                className="inline-flex h-9 items-center rounded-lg border border-[#1E2A3A] px-4 text-sm
                       text-gray-400 hover:bg-[#F8AF18] hover:text-white transition-colors bg-[#1E2A3A]"
              >
                Thoát
              </Button>

            </DialogClose>

            <Button
              type="button"
              disabled={!isValid}
              onClick={() => setShowCreateConfirm(true)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-bold",
                isValid
                  ? "bg-[#1565C0] text-white hover:bg-[#1976D2] active:scale-95 shadow-md shadow-[#1565C0]/30"
                  : "bg-[#1565C0] text-gray-300 cursor-not-allowed"
              )}
            >
              <Plus size={14} /> Tạo nhóm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b px-4">
        <div className="py-8 px-4">
          <h1 className="text-3xl font-bold text-white leading-tight">
            Nhóm của bạn
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Quản lý và cộng tác cùng các nhóm của bạn.
            <span className="text-gray-400">
              Bạn có {groups.length} nhóm.
            </span>
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#1565C0] px-3 py-2 text-sm
               text-white hover:bg-[#1976D2] active:scale-95
               shadow-md shadow-[#1565C0]/25"
        >
          <Plus size={15} />
          Tạo nhóm mới
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1E2A3A]">
            <Users size={24} className="text-gray-500" />
          </div>
          <p className="text-gray-400 text-sm">
            {search ? `No groups matching "${search}"` : "You don't have any groups yet."}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLeave={handleLeave}
              style={{
                animationDelay: `${i * 60}ms`,
                animation: "fadeSlideUp 0.35s ease-out both",
                background: "#1A2332",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}