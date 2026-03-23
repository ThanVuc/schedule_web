'use client';

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui";
import { Plus } from "lucide-react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogBody,
    DialogCancelButton, DialogPrimaryButton,
} from "../../common/teamDialog";


export interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (name: string) => void;
}


export const CreateGroupDialog = ({ open, onOpenChange, onConfirm }: CreateGroupDialogProps) => {
    const [name, setName] = useState("");

    const isValid = name.trim().length > 0;

    useEffect(() => {
        if (open) setName("");
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} warnOnClose={isValid}>
            <DialogContent size="md">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl">Tạo nhóm mới</DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        Nhóm giúp bạn tổ chức các thành viên và phối hợp làm việc hiệu quả hơn.
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <label className="text-xs text-gray-400 uppercase pb-2 block">Tên nhóm</label>
                    <Input
                        type="text"
                        placeholder="Nhập tên nhóm của bạn"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={50}
                        className="w-full rounded-lg border border-[#1E2A3A] bg-[#111820] px-3 py-2 text-sm
                                   text-white placeholder:text-gray-600 focus:outline-none
                                   focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]/40 transition-colors"
                    />
                </DialogBody>

                <DialogFooter>
                    <DialogClose asChild>
                        <DialogCancelButton>Thoát</DialogCancelButton>
                    </DialogClose>
                    <DialogPrimaryButton
                        disabled={!isValid}
                        confirmSubmit
                        onClick={() => onConfirm(name.trim())}
                    >
                        <Plus size={14} /> Tạo nhóm
                    </DialogPrimaryButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};