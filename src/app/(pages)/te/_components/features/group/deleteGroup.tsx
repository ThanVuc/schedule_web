'use client';

import React from "react";
import { Trash2 } from "lucide-react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogBody,
    DialogCancelButton, DialogDangerButton,
} from "../../common/teamDialog";
import { type Group } from "./types";
import { TrashIcon } from "@/components/icon";

export interface DeleteGroupDialogProps {
    target: Group | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string) => void;
}


export const DeleteGroupDialog = ({ target, onOpenChange, onConfirm }: DeleteGroupDialogProps) => {
    const handleConfirm = () => {
        if (!target) return;
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
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Bạn có chắc muốn xóa nhóm{" "}
                        <span className="font-semibold text-white">{target?.name}</span>?{" "}
                        Tất cả thành viên trong nhóm sẽ bị xóa khỏi nhóm này.
                    </p>
                </DialogBody>

                <DialogFooter>
                    <DialogClose asChild>
                        <DialogCancelButton className="">
                            Hủy
                        </DialogCancelButton>
                    </DialogClose>
                    <DialogDangerButton onClick={handleConfirm}>
                        <Trash2 size={14} /> Xóa nhóm
                    </DialogDangerButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};