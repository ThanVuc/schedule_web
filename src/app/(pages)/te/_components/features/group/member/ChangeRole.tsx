"use client";

import React, { useState, useEffect } from "react";
import { TeamDialogForm } from "../../../common/TeamDialog";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamMemberApiUrl } from "@/api/teamGroup";
import { memberApiToastMessage } from "./memberToastErrors";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";
import { Check, ChevronDown } from "lucide-react";
import type { MemberRole, RoleDefinition, RoleDropdownProps, ChangeRoleDialogProps } from "./memberTypes";

export type { MemberRole, ChangeRoleDialogProps };

function toApiRole(role: MemberRole) {
    return role.toLowerCase();
}

export const ROLES: RoleDefinition[] = [
    { value: "Owner", label: "Owner", desc: "Quyền quản trị viên đầy đủ để quản lý thành viên và xem toàn bộ nội dung." },
    { value: "Manager", label: "Manager", desc: "Quản lý thành viên và sprints" },
    { value: "Member", label: "Member", desc: "Tham gia và đóng góp vào công việc" },
    { value: "Viewer", label: "Viewer", desc: "Chỉ xem, không được chỉnh sửa" },
];

export function RoleDropdown({
    value,
    onChange,
    triggerClassName,
}: RoleDropdownProps) {
    const selected = ROLES.find((r) => r.value === value) ?? ROLES[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    className={`flex items-center justify-between rounded-lg px-4 py-2.5
                                border border-[#1E2A3A] bg-[#111820] text-sm font-medium text-white
                                hover:bg-[#2A3A50] transition-colors duration-150
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#42A5F5]/50
                                ${triggerClassName ?? "w-full"}`}
                >
                    <span className="truncate">{selected.label}</span>
                    <ChevronDown size={16} className="text-gray-500" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="z-[200] w-[var(--radix-dropdown-menu-trigger-width)]
                           border-[#1E2A3A] bg-[#0D1520] shadow-xl shadow-black/60"
            >
                {ROLES.map((role) => {
                    const isActive = value === role.value;
                    return (
                        <DropdownMenuItem
                            key={role.value}
                            onSelect={() => onChange(role.value)}
                            className={`justify-between cursor-pointer ${isActive
                                ? "bg-[#F8AF18] text-black font-semibold hover:bg-[#F8AF18]"
                                : "text-gray-300 hover:bg-[#1A2535] hover:text-white"
                                }`}
                        >
                            <span className="flex-1 truncate pr-2">{role.label}</span>
                            {isActive && <Check size={16} className="text-black" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function ChangeRoleDialog({
    open,
    onOpenChange,
    memberName,
    currentRole,
    memberId,
    groupId,
    onSuccess,
}: ChangeRoleDialogProps) {
    const { setToast } = useToastState();
    const { sendRequest: changeRoleRequest } = useAxiosMutation({
        method: "PATCH",
        url: teamMemberApiUrl.list(groupId),
    });
    const [role, setRole] = useState<MemberRole>(currentRole);

    useEffect(() => {
        if (open) setRole(currentRole);
    }, [open, currentRole]);

    const roleObj = ROLES.find((r) => r.value === role)!;

    return (
        <TeamDialogForm
            open={open}
            onOpenChange={onOpenChange}
            size="md"
            title="Change Member Role"
            description={`Update the role for ${memberName}`}
            warnOnClose={role !== currentRole}
            submitDisabled={role === currentRole || !groupId || !memberId}
            submitButtonText="Update Role"
            cancelButtonText="Cancel"
            onSubmit={async () => {
                const { error } = await changeRoleRequest({ role: toApiRole(role) }, memberId);
                if (error) {
                    setToast({
                        title: "Đổi vai trò thất bại",
                        message: memberApiToastMessage(
                            error,
                            "changeMemberRole",
                            "Không thể cập nhật vai trò thành viên.",
                        ),
                        variant: "error",
                    });
                    return;
                }
                onSuccess?.();
                onOpenChange(false);
            }}
        >
            <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</p>
                <RoleDropdown value={role} onChange={setRole} />
                <div className="flex items-start rounded-lg px-4 py-3 border border-[#1E2A3A] transition-all duration-200">
                    <p className="text-xs text-gray-400 leading-relaxed">{roleObj.desc}</p>
                </div>
            </div>
        </TeamDialogForm>
    );
}