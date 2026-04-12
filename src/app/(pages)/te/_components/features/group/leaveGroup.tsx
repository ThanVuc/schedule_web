'use client';

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogBody,
    DialogCancelButton, DialogDangerButton,
} from "../../common/TeamDialog";
import { type Group } from "./types";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamGroupApiUrl } from "@/api/teamGroup";


export interface LeaveGroupDialogProps {
    target: Group | null;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}


export const LeaveGroupDialog = ({ target, onOpenChange, onSuccess }: LeaveGroupDialogProps) => {
    const { setToast } = useToastState();
    const [submitting, setSubmitting] = useState(false);
    const { sendRequest: leaveGroupRequest } = useAxiosMutation({
        method: "PATCH",
        url: teamGroupApiUrl.list,
    });

    const handleConfirm = async () => {
        if (!target) return;
        setSubmitting(true);
        const tryLeave = async (groupId: string) =>
            leaveGroupRequest(undefined, `${groupId}/members/leave`);

        let { error } = await tryLeave(target.id);
        const status = error?.response?.status;
        const fallbackId = target.altGroupId;
        if (error && fallbackId && fallbackId !== target.id && (status === 404 || status === 422)) {
            ({ error } = await tryLeave(fallbackId));
        }

        setSubmitting(false);

        if (error) {
            setToast({
                title: "Rời nhóm thất bại",
                message: "Không thể rời nhóm vào lúc này.",
                variant: "error",
            });
            return;
        }

        setToast({
            title: "Thành công",
            message: "Bạn đã rời nhóm.",
            variant: "success",
        });
        onSuccess?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={!!target} onOpenChange={onOpenChange}>
            <DialogContent size="sm" >
                <DialogHeader
                    icon={<LogOut size={18} className="text-orange-400" />
                    }
                >
                    <DialogTitle className="text-white text-xl">Rời nhóm</DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        Bạn sẽ mất quyền truy cập vào nhóm này.
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Bạn có chắc muốn rời khỏi nhóm{" "}
                        <span className="font-semibold text-white">{target?.name}</span>?{" "}
                        Bạn sẽ cần được mời lại để tham gia nhóm này.
                    </p>
                </DialogBody>

                <DialogFooter>
                    <DialogClose asChild>
                        <DialogCancelButton
                            disabled={submitting}
                            className="bg-transparent hover:bg-[#1E2A3A] hover:text-gray-300"
                        >
                            Hủy
                        </DialogCancelButton>
                    </DialogClose>
                    <DialogDangerButton
                        disabled={submitting}
                        onClick={() => void handleConfirm()}
                        className="bg-orange-600 hover:bg-orange-500 shadow-orange-900/40"
                    >
                        <LogOut size={14} /> Rời nhóm
                    </DialogDangerButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};