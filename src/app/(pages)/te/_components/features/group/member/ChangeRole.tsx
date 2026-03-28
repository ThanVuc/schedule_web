"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
    DialogBody, DialogFooter, DialogCancelButton, DialogPrimaryButton, DialogClose,
} from "../../../common/TeamDialog";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";
import { Check, ChevronDown } from "lucide-react";

export type MemberRole = "Owner" | "Manager" | "Member" | "Viewer";

export const ROLES: { value: MemberRole; label: string; desc: string }[] = [
    { value: "Owner", label: "Owner", desc: "Quyền quản trị viên đầy đủ để quản lý thành viên và xem toàn bộ nội dung." },
    { value: "Manager", label: "Manager", desc: "Quản lý thành viên và sprints" },
    { value: "Member", label: "Member", desc: "Tham gia và đóng góp vào công việc" },
    { value: "Viewer", label: "Viewer", desc: "Chỉ xem, không được chỉnh sửa" },
];


export function RoleDropdown({
    value,
    onChange,
    triggerClassName,
}: {
    value: MemberRole;
    onChange: (r: MemberRole) => void;
    triggerClassName?: string;
}) {
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
                            className={`justify-between cursor-pointer
                                ${isActive
                                    ? "bg-[#F8AF18] text-black font-semibold hover:bg-[#F8AF18]"
                                    : "text-gray-300 hover:bg-[#1A2535] hover:text-white"}`
                            }
                        >
                            <span className="flex-1 truncate pr-2">{role.label}</span>
                            {isActive ? <Check size={16} className="text-black" /> : null}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface ChangeRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    memberName: string;
    currentRole: MemberRole;
    onConfirm: (newRole: MemberRole) => void;
}

export function ChangeRoleDialog({
    open, onOpenChange, memberName, currentRole, onConfirm,
}: ChangeRoleDialogProps) {
    const [selected, setSelected] = useState<MemberRole>(currentRole);

    const isDirty = selected !== currentRole;
    const roleObj = ROLES.find((r) => r.value === selected)!;

    useEffect(() => {
        if (open) setSelected(currentRole);
    }, [open, currentRole]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="md">
                <DialogHeader >
                    <DialogTitle className="text-white text-base">Thay đổi vai trò thành viên</DialogTitle>
                    <DialogDescription className="text-gray-500 text-xs">
                        Cập nhật vai trò cho{" "}
                        <span className="text-gray-300 font-medium">{memberName}</span>
                    </DialogDescription>
                </DialogHeader>

                <DialogBody className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vai trò</p>

                    <RoleDropdown value={selected} onChange={setSelected} />

                    <div className={`flex items-start gap-3 rounded-lg px-4 py-3
                                     border border-[#1E2A3A] transition-all duration-200`}>
                        <p className="text-xs text-gray-400 leading-relaxed">{roleObj.desc}</p>
                    </div>
                </DialogBody>

                <DialogFooter className="sm:justify-between">
                    <DialogClose asChild>
                        <DialogCancelButton>Thoát</DialogCancelButton>
                    </DialogClose>
                    <DialogPrimaryButton
                        disabled={!isDirty}
                        onClick={() => onConfirm(selected)}
                    >
                        Cập nhật vai trò
                    </DialogPrimaryButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}