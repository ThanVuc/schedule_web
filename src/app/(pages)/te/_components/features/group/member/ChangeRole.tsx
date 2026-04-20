"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { TeamDialogForm } from "../../../common/TeamDialog";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamMemberApiUrl } from "@/api/teamGroup";
import { authApiUrl } from "@/api";
import { useCsrfToken } from "@/context/csrf.context";
import { memberApiToastMessage } from "./memberToastErrors";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";
import { Check, ChevronDown } from "lucide-react";
import type { MemberRole, RoleDropdownProps, ChangeRoleDialogProps, RoleOption } from "./memberTypes";
import { GroupRole } from "../../../../_constants/groupRole";

export type { MemberRole, ChangeRoleDialogProps };

function toApiRole(role: MemberRole) {
    if (role === "Owner") return GroupRole.OWNER;
    if (role === "Manager") return GroupRole.MANAGER;
    if (role === "Member") return GroupRole.MEMBER;
    return GroupRole.VIEWER;
}

export const ALL_ROLES: RoleOption[] = [
    { value: "Owner", label: "Owner", desc: "Toàn quyền quản lý nhóm, bao gồm xóa nhóm và chuyển quyền sở hữu" },
    { value: "Manager", label: "Manager", desc: "Quản lý thành viên và sprints" },
    { value: "Member", label: "Member", desc: "Tham gia và đóng góp vào công việc" },
    { value: "Viewer", label: "Viewer", desc: "Chỉ xem, không được chỉnh sửa" },
];

export const ROLES: RoleOption[] = ALL_ROLES.slice(1);

export function RoleDropdown({
    value,
    onChange,
    triggerClassName,
    availableRoles,
}: RoleDropdownProps & { availableRoles?: RoleOption[] }) {
    const roles = availableRoles?.length ? availableRoles : ROLES;
    const selected = roles.find((r) => r.value === value) ?? roles[0];

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
                {roles.map((role) => {
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
    currentRole,
    memberId,
    groupId,
    onSuccess,
}: ChangeRoleDialogProps) {
    const { setToast } = useToastState();
    const csrfToken = useCsrfToken();
    const { sendRequest: changeRoleRequest } = useAxiosMutation({
        method: "PATCH",
        url: teamMemberApiUrl.updateRole(groupId, memberId),
    });
    const [role, setRole] = useState<MemberRole>(currentRole);


    useEffect(() => {
        if (open) setRole(currentRole);
    }, [open, currentRole]);

    const availableRoles = ALL_ROLES;
    const roleObj = ALL_ROLES.find((item) => item.value === role) ?? ALL_ROLES[0];

    return (
        <TeamDialogForm
            open={open}
            onOpenChange={onOpenChange}
            size="md"
            title="Đổi vai trò thành viên"
            description={`Cập nhật vai trò cho thành viên`}
            warnOnClose={role !== currentRole}
            submitDisabled={role === currentRole || !groupId || !memberId}
            submitButtonText="Cập nhật vai trò"
            cancelButtonText="Hủy"
            onSubmit={async () => {
                const { error } = await changeRoleRequest({
                    new_role: toApiRole(role),
                });
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
                try {
                    await axios({
                        method: "POST",
                        url: authApiUrl.refreshToken,
                        withCredentials: true,
                        headers: {
                            "X-CSRF-Token": csrfToken ?? "",
                        },
                    });
                } catch {

                }
                onSuccess?.();
                onOpenChange(false);
            }}
        >
            <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vai trò</p>
                <RoleDropdown value={role} onChange={setRole} availableRoles={availableRoles} />
                <div className="flex items-start rounded-lg px-4 py-3 border border-[#1E2A3A] transition-all duration-200">
                    <p className="text-xs text-gray-400 leading-relaxed">{roleObj.desc}</p>
                </div>
            </div>
        </TeamDialogForm>
    );
}