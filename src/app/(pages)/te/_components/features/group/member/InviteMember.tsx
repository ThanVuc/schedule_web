"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Link2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
    DialogBody, DialogFooter, DialogPrimaryButton, DialogClose,
} from "../../../common/TeamDialog";
import type {
    InviteCodeResponse,
    InviteMemberDialogMode,
    InviteMemberDialogProps,
} from "./memberTypes";
import { MemberRole, RoleDropdown } from "./ChangeRole";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamMemberApiUrl } from "@/api/teamGroup";
import { memberApiToastMessage } from "./memberToastErrors";

function toApiRoleNumber(role: MemberRole) {
    return role === "Owner" ? 1 : role === "Manager" ? 2 : role === "Member" ? 3 : 4;
}

function getInviteCode(raw: unknown): string {
    const data = raw as InviteCodeResponse | undefined;
    return (
        data?.code ||
        data?.invite?.code ||
        data?.item?.code ||
        data?.data?.code ||
        data?.data?.item?.code ||
        data?.metadata?.code ||
        data?.metadata?.item?.code ||
        ""
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Fallback for environments where Clipboard API is blocked.
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="flex items-center gap-1.5 shrink-0 h-8 px-3 rounded-md border border-[#1E2A3A]
                       text-xs text-gray-400 hover:text-white hover:border-[#42A5F5] transition-colors disabled:opacity-50"
        >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

export type { InviteMemberDialogProps };

export function InviteMemberDialog({
    open,
    onOpenChange,
    groupId,
    altGroupId,
    inviteLinkGroupId,
    onInviteSuccess,
    onActiveGroupResolved,
}: InviteMemberDialogProps) {
    const { setToast } = useToastState();
    const { sendRequest: inviteRequest } = useAxiosMutation({
        method: "POST",
        url: teamMemberApiUrl.invite(groupId),
    });
    const { sendRequest: inviteRequestAlt } = useAxiosMutation({
        method: "POST",
        url: teamMemberApiUrl.invite(altGroupId || groupId),
    });

    const [mode, setMode] = useState<InviteMemberDialogMode>("form");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<MemberRole>("Member");
    const [inviteLink, setInviteLink] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setMode("form");
            setEmail("");
            setRole("Member");
            setInviteLink("");
        }
    }, [open]);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const requestInvite = async (args: { role: MemberRole; email?: string }) => {
        const roleNumber = toApiRoleNumber(args.role);
        const payload = { role: roleNumber, ...(args.email ? { email: args.email } : {}) };
        let result = await inviteRequest(payload);
        if (result.error?.response?.status === 400 || result.error?.response?.status === 422) {
            result = await inviteRequest({ group_role: roleNumber, ...(args.email ? { email: args.email } : {}) });
        }
        const status = result.error?.response?.status;

        if (
            result.error &&
            altGroupId &&
            altGroupId !== groupId &&
            (status === 404 || status === 422)
        ) {
            result = await inviteRequestAlt(payload);
            if (result.error?.response?.status === 400 || result.error?.response?.status === 422) {
                result = await inviteRequestAlt({
                    group_role: roleNumber,
                    ...(args.email ? { email: args.email } : {}),
                });
            }
            if (!result.error) {
                onActiveGroupResolved?.(altGroupId);
            }
        }

        return result;
    };

    const handleSend = async () => {
        if (!isEmailValid || !groupId) return;
        if (role === "Owner") {
            setToast({
                title: "Gửi lời mời thất bại",
                message: "Không thể mời thành viên với vai trò Owner.",
                variant: "warning",
            });
            return;
        }
        setLoading(true);
        const { error } = await requestInvite({ email, role });
        setLoading(false);
        if (error) {
            setToast({
                title: "Gửi lời mời thất bại",
                message: memberApiToastMessage(error, "inviteMember", "Không thể gửi lời mời qua email."),
                variant: "error",
            });
            return;
        }
        setToast({ title: "Thành công", message: "Đã gửi lời mời thành viên.", variant: "success" });
        onInviteSuccess?.();
        onOpenChange(false);
    };

    const handleGenerateLink = async () => {
        if (!groupId) return;
        if (role === "Owner") {
            setToast({
                title: "Tạo link thất bại",
                message: "Không thể tạo link mời với vai trò Owner.",
                variant: "warning",
            });
            return;
        }
        setLoading(true);
        const { data, error } = await requestInvite({ role });
        setLoading(false);
        if (error) {
            setToast({
                title: "Tạo link thất bại",
                message: memberApiToastMessage(error, "inviteMember", "Không thể tạo link mời."),
                variant: "error",
            });
            return;
        }
        const code = getInviteCode(data);
        if (!code) {
            setToast({
                title: "Tạo link thất bại",
                message: "Không nhận được mã code từ hệ thống.",
                variant: "error",
            });
            return;
        }
        const apiDomain = "https://schedulr.com/api/v1";
        const groupUrl = `https://schedulr.com/te/groups/${inviteLinkGroupId}`;
        setInviteLink(
            `${apiDomain}?code=${encodeURIComponent(code)}&url=${encodeURIComponent(groupUrl)}`,
        );
        setMode("link");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} warnOnClose={mode === "form" && email.length > 0}>
            <DialogContent size="md">
                <DialogHeader>
                    <DialogTitle className="text-white text-base">Mời thành viên</DialogTitle>
                    <DialogDescription className="text-gray-500 text-xs">
                        Mời thành viên mới tham gia nhóm của bạn qua email hoặc chia sẻ đường dẫn.
                    </DialogDescription>
                </DialogHeader>

                {mode === "form" && (
                    <>
                        <DialogBody className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-gray-400 uppercase pb-2 block">
                                    Địa chỉ Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-[#1E2A3A] bg-[#111820] px-3 py-2 text-sm
                                               text-white placeholder:text-gray-600 focus:outline-none
                                               focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]/40 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 uppercase pb-2 block">Vai trò</label>
                                <RoleDropdown value={role} onChange={setRole} />
                            </div>
                        </DialogBody>

                        <DialogFooter className="sm:justify-between">
                            <Button
                                type="button"
                                onClick={handleGenerateLink}
                                disabled={loading}
                                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-[#1E2A3A]
                                           bg-[#0F1A2F] text-sm text-gray-300 hover:text-white
                                           hover:bg-[#F8AF18] hover:text-black transition-colors disabled:opacity-50"
                            >
                                <Link2 size={13} />
                                Tạo liên kết mời
                            </Button>
                            <DialogPrimaryButton disabled={!isEmailValid || loading} onClick={handleSend}>
                                Gửi lời mời
                            </DialogPrimaryButton>
                        </DialogFooter>
                    </>
                )}

                {mode === "link" && (
                    <>
                        <DialogBody className="flex flex-col gap-4 max-w-[500px] w-full">
                            <div>
                                <label className="text-xs text-gray-400 uppercase pb-2 block">
                                    Vai trò
                                </label>
                                <RoleDropdown value={role} onChange={setRole} />
                            </div>

                            <div className="w-full">
                                <label className="text-xs text-gray-400 uppercase pb-2 flex items-center gap-1.5">
                                    <Link2 size={12} /> Link mời
                                </label>

                                <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[#1E2A3A]
                        bg-[#111820] px-3 py-2">
                                    <span className="min-w-0 flex-1 truncate text-sm text-gray-300">
                                        {inviteLink}
                                    </span>
                                    <CopyButton text={inviteLink} />
                                </div>
                            </div>
                        </DialogBody>

                        <DialogFooter className="sm:justify-between">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="inline-flex items-center h-9 px-4 rounded-lg border border-[#1E2A3A]
                                               bg-[#0F1A2F] text-sm font-medium text-gray-300 hover:text-black hover:bg-[#F8AF18] transition-colors"
                                >
                                    Xong
                                </Button>
                            </DialogClose>
                            <DialogPrimaryButton
                                onClick={() => {
                                    setMode("form");
                                    setEmail("");
                                    setInviteLink("");
                                }}
                            >
                                Mời qua email
                            </DialogPrimaryButton>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}