"use client";

import React, { useState } from "react";
import { UserPlus, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChangeRoleDialog, MemberRole } from "./ChangeRole";
import { DeleteMemberDialog, MemberToDelete } from "./DeleteMember";
import { InviteMemberDialog } from "./InviteMember";
import { Button } from "@/components/ui";

interface Member {
    id: string;
    name: string;
    email: string;
    role: MemberRole;
    joined: string;
    avatar: string;
}

const INITIAL_MEMBERS: Member[] = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Owner", joined: "15/1/2024", avatar: "🧑‍💻" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Manager", joined: "20/1/2024", avatar: "👩‍💼" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Member", joined: "1/2/2024", avatar: "🧔" },
    { id: "4", name: "Alice Williams", email: "alice@example.com", role: "Member", joined: "5/2/2024", avatar: "👩‍🎨" },
    { id: "5", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", joined: "10/2/2024", avatar: "🧑" },
];

const ROLE_STYLE: Record<MemberRole, string> = {
    Owner: "bg-[#F8AF18] text-black border-transparent",
    Manager: "bg-[#1565C0] text-white border-transparent",
    Member: "bg-[#1E2A3A] text-gray-300 border-[#2A3A50]",
    Viewer: "bg-[#1E2A3A] text-gray-500 border-[#2A3A50]",
};

function RoleBadge({ role }: { role: MemberRole }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full w-18 text-xs font-medium
                          border ${ROLE_STYLE[role]}`}>
            {role}
        </span>
    );
}

interface ActionsMenuProps {
    member: Member;
    onChangeRole: () => void;
    onRemove: () => void;
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
    const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [changeTarget, setChangeTarget] = useState<Member | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<MemberToDelete | null>(null);

    const handleChangeRole = (memberId: string, newRole: MemberRole) => {
        setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
        setChangeTarget(null);
    };

    const handleRemove = (memberId: string) => {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        setDeleteTarget(null);
    };

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
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-bold
                               bg-[#1565C0] text-white hover:bg-[#1976D2] active:scale-95
                               shadow-md shadow-[#1565C0]/30 transition-all duration-150"
                >
                    <UserPlus size={15} />
                    Mời thành viên
                </Button>
            </div>

            <div className="rounded-xl border border-[#1E2A3A] overflow-hidden">
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
                            <div className="size-8 rounded-full bg-[#1E2A3A] flex items-center justify-center
                                            text-base shrink-0">
                                {member.avatar}
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

                {members.length === 0 && (
                    <div className="py-16 text-center text-gray-600 text-sm">
                        Chưa có thành viên nào trong group.
                    </div>
                )}
            </div>

            <InviteMemberDialog
                open={inviteOpen}
                onOpenChange={setInviteOpen}
                onSendInvite={async (email, role) => { console.log("Send invite:", email, role); }}
                onGenerateLink={async () =>
                    `https://groups.example.com/invite/${Math.random().toString(36).slice(2, 9)}`
                }
            />

            {changeTarget && (
                <ChangeRoleDialog
                    open={!!changeTarget}
                    onOpenChange={(open) => { if (!open) setChangeTarget(null); }}
                    memberName={changeTarget.name}
                    currentRole={changeTarget.role}
                    onConfirm={(newRole) => handleChangeRole(changeTarget.id, newRole)}
                />
            )}

            {deleteTarget && (
                <DeleteMemberDialog
                    target={deleteTarget}
                    onOpenChange={(open) => {
                        if (!open) setDeleteTarget(null);
                    }}
                    onConfirm={handleRemove}
                />
            )}
        </div>
    );
};

export default BoardMemberPage;