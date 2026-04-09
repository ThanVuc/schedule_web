'use client';

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogBody,
    DialogCancelButton, DialogDangerButton,
} from "../../common/TeamDialog";
import { Input } from "@/components/ui";
import { type Group } from "./types";
import { TrashIcon } from "@/components/icon";

export interface DeleteGroupDialogProps {
    target: Group | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string) => void;
}


export const DeleteGroupDialog = ({ target, onOpenChange, onConfirm }: DeleteGroupDialogProps) => {
    const [confirmName, setConfirmName] = useState("");
    const expectedName = target?.name?.trim() ?? "";
    const canDelete = confirmName.trim() === expectedName && expectedName.length > 0;

    useEffect(() => {
        if (target) setConfirmName("");
    }, [target]);

    const handleConfirm = () => {
        if (!target || !canDelete) return;
        onConfirm(target.id);
    };

    return (
        <Dialog open={!!target} onOpenChange={onOpenChange}>
            <DialogContent size="sm" >
                <DialogHeader
                    icon={<TrashIcon className="text-red-500" />
                    }
                >
                    <DialogTitle className="">Xóa nhóm</DialogTitle>
                    <DialogDescription className="">
                        Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Bạn có chắc muốn xóa nhóm{" "}
                            <span className="font-semibold text-white">{target?.name}</span>?{" "}
                            Tất cả thành viên trong nhóm sẽ bị xóa khỏi nhóm này.
                        </p>
                        <p className="text-xs text-red-200/80">
                            Nhập chính xác tên nhóm để xác nhận xóa.
                        </p>
                        <Input
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            placeholder={expectedName || "Tên nhóm"}
                            className="w-full bg-[#0D1520] border border-[#1E2A3A] text-white"
                        />
                    </div>
                </DialogBody>

                <DialogFooter>
                    <DialogClose asChild>
                        <DialogCancelButton className="">
                            Hủy
                        </DialogCancelButton>
                    </DialogClose>
                    <DialogDangerButton onClick={handleConfirm} disabled={!canDelete}>
                        <Trash2 size={14} /> Xóa nhóm
                    </DialogDangerButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};