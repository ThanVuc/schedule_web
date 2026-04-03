'use client';

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui";
import { Pencil } from "lucide-react";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogBody,
    DialogCancelButton, DialogPrimaryButton,
    SubmitConfirmModal,
} from "../../common/teamDialog";
import { type Group } from "./types";


export interface EditGroupDialogProps {
    target: Group | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string, name: string) => void;
}

export const EditGroupDialog = ({ target, onOpenChange, onConfirm }: EditGroupDialogProps) => {
    const [name, setName] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const isDirty = name.trim() !== target?.name;
    const isValid = name.trim().length > 0;

    useEffect(() => {
        if (target) setName(target.name);
    }, [target]);

    const handleConfirm = () => {
        if (!target) return;
        setShowConfirm(false);
        onConfirm(target.id, name.trim());
    };

    return (
        <>
            {showConfirm && (
                <SubmitConfirmModal
                    onConfirm={handleConfirm}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            <Dialog open={!!target} onOpenChange={onOpenChange} warnOnClose={isDirty}>
                <DialogContent size="md">
                    <DialogHeader>
                        <DialogTitle className="text-white text-xl">Chỉnh sửa nhóm</DialogTitle>
                        <DialogDescription className="text-gray-500 text-sm">
                            Cập nhật thông tin nhóm của bạn.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogBody>
                        <label className="text-xs text-gray-400 uppercase pb-2 block">Tên nhóm</label>
                        <Input
                            type="text"
                            placeholder="Nhập tên nhóm"
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
                        <DialogPrimaryButton disabled={!isValid || !isDirty} onClick={() => setShowConfirm(true)}>
                            <Pencil size={14} /> Lưu thay đổi
                        </DialogPrimaryButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};