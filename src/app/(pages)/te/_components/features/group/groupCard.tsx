'use client';

import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Users, MoreVertical, Pencil, Trash2, LogOut, Clock } from "lucide-react";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { type Group, type Role } from "./types";


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
            <AvatarFallback className="bg-[#1E2A3A] text-white text-sm font-bold">
                {initials}
            </AvatarFallback>
        </Avatar>
    );
};
interface CardDropdownProps {
    groupId: string;
    role: Role;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onLeave: (id: string) => void;
}

const CardDropdown = ({ groupId, role, onEdit, onDelete, onLeave }: CardDropdownProps) => (
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
                    <Pencil size={14} className="text-blue-400" /> Chỉnh sửa nhóm
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
                        <Trash2 size={14} /> Xóa nhóm
                    </DropdownMenuItem>
                </>
            )}

            {role !== "Owner" && (
                <DropdownMenuItem
                    onClick={() => onLeave(groupId)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-orange-400
                     hover:bg-orange-500/10 hover:text-orange-300 transition-colors cursor-pointer"
                >
                    <LogOut size={14} /> Rời nhóm
                </DropdownMenuItem>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
);

export interface GroupCardProps {
    group: Group;
    isSelected: boolean;
    style?: React.CSSProperties;
    onClick: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onLeave: (id: string) => void;
}

export const GroupCard = ({
    group, isSelected, style, onClick, onEdit, onDelete, onLeave,
}: GroupCardProps) => (
    <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(group.id)}
        onKeyDown={(e) => e.key === "Enter" && onClick(group.id)}
        style={style}
        className={cn(
            "group relative flex flex-col rounded-xl border-2 bg-[#0D1117] p-5 cursor-pointer",
            "transition-all duration-200 ease-out outline-none select-none",
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