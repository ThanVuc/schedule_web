"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { UserPlus, MoreVertical } from "lucide-react";
import { useAxios } from "@/hooks/useAxios";
import { teamMemberApiUrl } from "@/api/teamGroup";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { ActionsMenuProps, Member, MemberApiModel, MemberRole, MemberToDelete } from "./memberTypes";
import { ChangeRoleDialog } from "./ChangeRole";
import { DeleteMemberDialog } from "./DeleteMember";
import { InviteMemberDialog } from "./InviteMember";
import { Button } from "@/components/ui";
import { GroupRole } from "../../../../_constants/groupRole";
import { enumDisplayMap } from "../../../../_constants/enumDisplayMap";

const ROLE_STYLE: Record<MemberRole, string> = {
    Owner: "bg-[#F8AF18] text-black border-transparent",
    Manager: "bg-[#1565C0] text-white border-transparent",
    Member: "bg-[#1E2A3A] text-gray-300 border-[#2A3A50]",
    Viewer: "bg-[#1E2A3A] text-gray-500 border-[#2A3A50]",
};

const ROLE_NAME_TO_ENUM: Record<string, GroupRole> = {
    owner: GroupRole.OWNER,
    manager: GroupRole.MANAGER,
    member: GroupRole.MEMBER,
    viewer: GroupRole.VIEWER,
};

function RoleBadge({ role }: { role: MemberRole }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full w-18 text-xs font-medium
                          border ${ROLE_STYLE[role]}`}>
            {role}
        </span>
    );
}

function ActionsMenu({ member, onChangeRole, onRemove }: ActionsMenuProps) {
    if (member.role === "Owner") return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#1E2A3A]"
                >
                    <MoreVertical size={16} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="z-[200] bg-[#1A2332] w-35 border-gray-700"
            >
                <DropdownMenuItem
                    onSelect={onChangeRole}
                    className="z-[200] cursor-pointer hover:bg-[#F8AF18] hover:text-black data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-black"
                >
                    Thay đổi vai trò
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={onRemove}
                    className="z-[200] text-[#EF4444] cursor-pointer hover:bg-[#F8AF18] hover:text-black data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-black"
                >
                    Xóa thành viên
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const BoardMemberPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams<{ id: string }>();
    const groupId = params?.id ?? "";
    const altGroupId = (searchParams.get("altGroupId") ?? "").trim();
    const [activeGroupId, setActiveGroupId] = useState(groupId);

    useEffect(() => {
        setActiveGroupId(groupId);
    }, [groupId]);

    const { data: memberDataRaw, loading, refetch, error: memberListError } = useAxios<unknown>(
        {
            method: "GET",
            url: teamMemberApiUrl.list(activeGroupId),
        },
        [activeGroupId],
        !activeGroupId,
    );
    const [inviteOpen, setInviteOpen] = useState(false);
    const [changeTarget, setChangeTarget] = useState<Member | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<MemberToDelete | null>(null);

    const toRole = (role?: MemberApiModel["role"]): MemberRole => {
        const roleText = (() => {
            if (typeof role === "string" || typeof role === "number") return String(role);
            if (role && typeof role === "object" && "name" in role && typeof role.name === "string") return role.name;
            return "";
        })();
        const normalized = roleText.trim().toLowerCase();
        const maybeNumeric = Number(normalized);
        const roleEnum = Number.isNaN(maybeNumeric)
            ? ROLE_NAME_TO_ENUM[normalized] ?? GroupRole.MEMBER
            : (maybeNumeric as GroupRole);
        const display = enumDisplayMap.GROUP_ROLE[roleEnum] ?? enumDisplayMap.GROUP_ROLE[GroupRole.MEMBER];
        return (display === "Owner" || display === "Manager" || display === "Member" || display === "Viewer")
            ? display
            : "Member";
    };
    const toAvatarFallback = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

    const formatJoinedAt = (value?: string) => {
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        return format(d, "dd/MM/yyyy HH:mm");
    };

    const membersFromApi = (() => {
        const raw = memberDataRaw as any;
        if (!raw) return [];
        if (Array.isArray(raw)) return raw as MemberApiModel[];

        if (Array.isArray(raw.items)) return raw.items as MemberApiModel[];

        if (Array.isArray(raw.members)) return raw.members as MemberApiModel[];
        if (Array.isArray(raw.data)) return raw.data as MemberApiModel[];
        if (raw.data && Array.isArray(raw.data.items)) return raw.data.items as MemberApiModel[];
        if (raw.result && Array.isArray(raw.result.items)) return raw.result.items as MemberApiModel[];

        return [];
    })();
    const members: Member[] = membersFromApi.map((item) => {
        const memberId = item.id ?? "";
        const email = item.email ?? "";
        const name = item.name ?? "Unknown";
        const avatarUrl = item.avatar;
        return {
            id: memberId,
            name,
            email,
            role: toRole(item.role),
            joined: formatJoinedAt(item.joined_at),
            avatarUrl,
            avatarFallback: toAvatarFallback(name),
        };
    }).filter((item) => item.id);
    const errorStatus = memberListError?.response?.status;
    const isForbidden = errorStatus === 403 || errorStatus === 422 || errorStatus === 404;

    const isRetryPending = isForbidden && !!altGroupId && activeGroupId !== altGroupId;

    useEffect(() => {
        if (!isForbidden || !altGroupId || activeGroupId === altGroupId) return;
        setActiveGroupId(altGroupId);
        const next = new URLSearchParams(searchParams.toString());
        next.delete("altGroupId");
        router.replace(`/te/group/${altGroupId}?${next.toString()}`, { scroll: false });
    }, [activeGroupId, altGroupId, isForbidden, router, searchParams]);

    return (
        <div className="px-6 py-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">Thành viên</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Quản lý các thành viên nhóm và vai trò của họ.
                    </p>
                </div>
                <Button
                    onClick={() => setInviteOpen(true)}
                    disabled={isForbidden && !isRetryPending}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-bold
                               bg-[#1565C0] text-white hover:bg-[#1976D2] active:scale-95
                               shadow-md shadow-[#1565C0]/30 transition-all duration-150"
                >
                    <UserPlus size={15} />
                    Mời thành viên
                </Button>
            </div>

            <div className="rounded-xl border border-[#1E2A3A] overflow-hidden">
                {loading && (
                    <div className="px-4 py-3 text-sm text-gray-500 border-b border-[#1E2A3A]">
                        Đang tải danh sách thành viên...
                    </div>
                )}
                {isForbidden && !isRetryPending && (
                    <div className="px-4 py-3 text-sm text-amber-300 border-b border-[#1E2A3A] bg-amber-500/10">
                        Bạn không phải thành viên của group này nên không thể xem danh sách thành viên.
                    </div>
                )}
                <div className="grid grid-cols-[2fr_2fr_1fr_1fr_48px] px-4 py-3
                                border-b border-[#1E2A3A] bg-[#0D1726]">
                    {["Thành viên", "Email", "Vai trò", "Ngày vào", ""].map((h) => (
                        <span key={h} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {h}
                        </span>
                    ))}
                </div>

                {members.map((member, idx) => (
                    <div
                        key={member.id}
                        className={`grid grid-cols-[2fr_2fr_1fr_1fr_48px] items-center px-4 py-3.5
                                    transition-colors hover:bg-[#1E2A3A]/40
                                    ${idx !== members.length - 1 ? "border-b border-[#1E2A3A]" : ""}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-[#1E2A3A] flex items-center justify-center text-base shrink-0 overflow-hidden">
                                {member.avatarUrl ? (
                                    <img
                                        src={member.avatarUrl}
                                        alt={member.name}
                                        className="h-full w-full object-cover rounded-full"
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    member.avatarFallback
                                )}
                            </div>
                            <span className="text-sm font-medium text-white">{member.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{member.email}</span>
                        <RoleBadge role={member.role} />
                        <span className="text-sm text-gray-500">{member.joined}</span>
                        <div className="flex justify-end">
                            <ActionsMenu
                                member={member}
                                onChangeRole={() => setChangeTarget(member)}
                                onRemove={() =>
                                    setDeleteTarget({
                                        id: member.id,
                                        name: member.name,
                                        email: member.email,
                                        role: member.role,
                                    })
                                }
                            />
                        </div>
                    </div>
                ))}

                {members.length === 0 && !isForbidden && (
                    <div className="py-16 text-center text-gray-600 text-sm">
                        Chưa có thành viên nào trong group.
                    </div>
                )}
            </div>

            <InviteMemberDialog
                open={inviteOpen}
                onOpenChange={setInviteOpen}
                groupId={activeGroupId}
                altGroupId={altGroupId || undefined}
                inviteLinkGroupId={activeGroupId}
                onInviteSuccess={() => refetch?.()}
                onActiveGroupResolved={(newId) => {
                    setActiveGroupId(newId);
                    const next = new URLSearchParams(searchParams.toString());
                    next.delete("altGroupId");
                    router.replace(`/te/group/${newId}?${next.toString()}`, { scroll: false });
                }}
            />

            {changeTarget && (
                <ChangeRoleDialog
                    open={!!changeTarget}
                    onOpenChange={(open) => {
                        if (!open) setChangeTarget(null);
                    }}
                    memberName={changeTarget.name}
                    currentRole={changeTarget.role}
                    memberId={changeTarget.id}
                    groupId={activeGroupId}
                    onSuccess={() => refetch?.()}
                />
            )}

            {deleteTarget && (
                <DeleteMemberDialog
                    target={deleteTarget}
                    onOpenChange={(open) => {
                        if (!open) setDeleteTarget(null);
                    }}
                    groupId={activeGroupId}
                    onSuccess={() => refetch?.()}
                />
            )}
        </div>
    );
};

export default BoardMemberPage;