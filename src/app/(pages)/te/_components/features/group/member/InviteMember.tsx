"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Link2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
    DialogBody, DialogFooter, DialogPrimaryButton, DialogClose,
} from "../../../common/TeamDialog";
import { MemberRole, RoleDropdown } from "./ChangeRole";

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 shrink-0 h-8 px-3 rounded-md border border-[#1E2A3A]
                       text-xs text-gray-400 hover:text-white hover:border-[#42A5F5] transition-colors"
        >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

type Mode = "form" | "link";

interface InviteMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSendInvite?: (email: string, role: MemberRole) => Promise<void>;
    onGenerateLink?: (role: MemberRole) => Promise<string>;
}

export function InviteMemberDialog({
    open, onOpenChange, onSendInvite, onGenerateLink,
}: InviteMemberDialogProps) {
    const [mode, setMode] = useState<Mode>("form");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<MemberRole>("Member");
    const [inviteLink, setInviteLink] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) { setMode("form"); setEmail(""); setRole("Member"); setInviteLink(""); }
    }, [open]);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSend = async () => {
        if (!isEmailValid) return;
        setLoading(true);
        await onSendInvite?.(email, role);
        setLoading(false);
        onOpenChange(false);
    };

    const handleGenerateLink = async () => {
        setLoading(true);
        const link = await onGenerateLink?.(role)
            ?? `https://groups.example.com/invite/${Math.random().toString(36).slice(2, 9)}`;
        setInviteLink(link);
        setMode("link");
        setLoading(false);
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
                        <DialogBody className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-gray-400 uppercase pb-2 block">Vai trò</label>
                                <RoleDropdown value={role} onChange={setRole} />
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 uppercase pb-2 flex items-center gap-1.5 block">
                                    <Link2 size={12} /> Link mời
                                </label>
                                <div className="flex items-center gap-2 rounded-lg border border-[#1E2A3A]
                                                bg-[#111820] px-3 py-2">
                                    <span className="flex-1 text-sm text-gray-300 truncate">{inviteLink}</span>
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