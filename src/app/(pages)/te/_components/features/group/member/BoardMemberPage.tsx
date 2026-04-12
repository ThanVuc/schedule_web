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

function MemberAvatar({ member, sizeClass = "size-8" }: { member: Member; sizeClass?: string }) {
    return (
        <div
            className={`${sizeClass} rounded-full bg-[#2274e6] flex items-center justify-center text-sm sm:text-base font-medium text-gray-300 shrink-0 overflow-hidden`}
        >
            {(member.avatarUrl, member.avatarFallback)

            }
        </div>
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
        const avatarUrl = item.avatar;
        return {
            id: memberId,
            email,
            role: toRole(item.role),
            joined: formatJoinedAt(item.joined_at),
            avatarUrl,
            avatarFallback: toAvatarFallback("Member"),
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
        <div className="px-3 py-4 sm:px-5 sm:py-6 md:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 mb-5 sm:mb-6">
                <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Thành viên</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed max-w-prose">
                        Quản lý các thành viên nhóm và vai trò của họ.
                    </p>
                </div>
                <Button
                    onClick={() => setInviteOpen(true)}
                    disabled={isForbidden && !isRetryPending}
                    className="inline-flex items-center justify-center gap-2 h-10 sm:h-9 w-full sm:w-auto shrink-0 px-4 rounded-lg text-sm font-bold
                               bg-[#1565C0] text-white hover:bg-[#1976D2] active:scale-[0.98]
                               shadow-md shadow-[#1565C0]/30 transition-all duration-150"
                >
                    <UserPlus size={15} className="shrink-0" />
                    Mời thành viên
                </Button>
            </div>

            <div className="rounded-xl border border-[#1E2A3A] overflow-hidden bg-[#0B1120]/40">
                {loading && (
                    <div className="px-3 py-3 sm:px-4 text-sm text-gray-500 border-b border-[#1E2A3A]">
                        Đang tải danh sách thành viên...
                    </div>
                )}
                {isForbidden && !isRetryPending && (
                    <div className="px-3 py-3 sm:px-4 text-xs sm:text-sm text-amber-300 border-b border-[#1E2A3A] bg-amber-500/10 leading-relaxed">
                        Bạn không phải thành viên của group này nên không thể xem danh sách thành viên.
                    </div>
                )}
                <div
                    className="hidden md:grid md:grid-cols-[minmax(8rem,1.6fr)_minmax(0,1.8fr)_auto_minmax(6.5rem,1fr)_3rem] md:gap-3 md:items-center
                               px-4 py-3 border-b border-[#1E2A3A] bg-[#0D1726]"
                >
                    {["Thành viên", "Email", "Vai trò", "Ngày vào", ""].map((h) => (
                        <span
                            key={h}
                            className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500 truncate"
                        >
                            {h}
                        </span>
                    ))}
                </div>
                <div className="md:hidden divide-y divide-[#1E2A3A]">
                    {members.map((member) => (
                        <div key={`member-mobile-${member.id}`} className="px-3 py-4 sm:px-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <MemberAvatar member={member} sizeClass="size-10" />
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{member.email}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <RoleBadge role={member.role} />
                                            <span className="text-[11px] text-gray-500 tabular-nums">
                                                {member.joined}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 pt-0.5">
                                    <ActionsMenu
                                        member={member}
                                        onChangeRole={() => setChangeTarget(member)}
                                        onRemove={() =>
                                            setDeleteTarget({
                                                id: member.id,
                                                email: member.email,
                                                role: member.role,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden md:block">
                    {members.map((member, idx) => (
                        <div
                            key={`member-desktop-${member.id}`}
                            className={`grid grid-cols-[minmax(8rem,1.6fr)_minmax(0,1.8fr)_auto_minmax(6.5rem,1fr)_3rem] gap-3 items-center px-4 py-3.5
                                        transition-colors hover:bg-[#1E2A3A]/40
                                        ${idx !== members.length - 1 ? "border-b border-[#1E2A3A]" : ""}`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <MemberAvatar member={member} />
                            </div>
                            <span className="text-sm text-gray-400 truncate min-w-0">{member.email}</span>
                            <div className="justify-self-start">
                                <RoleBadge role={member.role} />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500 tabular-nums truncate">{member.joined}</span>
                            <div className="flex justify-end">
                                <ActionsMenu
                                    member={member}
                                    onChangeRole={() => setChangeTarget(member)}
                                    onRemove={() =>
                                        setDeleteTarget({
                                            id: member.id,
                                            email: member.email,
                                            role: member.role,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {members.length === 0 && !isForbidden && (
                    <div className="py-12 sm:py-16 px-4 text-center text-gray-600 text-sm">
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