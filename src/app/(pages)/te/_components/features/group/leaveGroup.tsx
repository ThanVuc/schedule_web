'use client';

import React from "react";
import { LogOut } from "lucide-react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogBody,
    DialogCancelButton, DialogDangerButton,
} from "../../common/TeamDialog";
import { type Group } from "./types";


export interface LeaveGroupDialogProps {
    target: Group | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string) => void;
}


export const LeaveGroupDialog = ({ target, onOpenChange, onConfirm }: LeaveGroupDialogProps) => {
    const handleConfirm = () => {
        if (!target) return;
        onConfirm(target.id);
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
                        <DialogCancelButton className="bg-transparent hover:bg-[#1E2A3A] hover:text-gray-300">
                            Hủy
                        </DialogCancelButton>
                    </DialogClose>
                    <DialogDangerButton
                        onClick={handleConfirm}
                        className="bg-orange-600 hover:bg-orange-500 shadow-orange-900/40"
                    >
                        <LogOut size={14} /> Rời nhóm
                    </DialogDangerButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};