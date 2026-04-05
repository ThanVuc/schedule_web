'use client';

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui";

import { TeamDialogForm } from "../../common/TeamDialog";

export interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (payload: { name: string; description?: string }) => void;
}

export const CreateGroupDialog = ({ open, onOpenChange, onConfirm }: CreateGroupDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (open) {
            setName("");
            setDescription("");
        }
    }, [open]);

    return (
        <TeamDialogForm
            open={open}
            onOpenChange={onOpenChange}
            size="md"
            title="Tạo nhóm mới"
            description="Nhóm giúp bạn tổ chức các thành viên và phối hợp làm việc hiệu quả hơn."
            warnOnClose={name.trim().length > 0}
            submitDisabled={name.trim().length === 0}
            submitConfirm
            submitButtonText="Tạo nhóm"
            cancelButtonText="Thoát"
            onSubmit={() => onConfirm({
                name: name.trim(),
                description: description.trim() || undefined,
            })}
        >
            <div className="space-y-4">
                <label className="text-xs text-gray-400 uppercase pb-2 block">Tên nhóm</label>
                <Input
                    type="text"
                    placeholder="Nhập tên nhóm của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={255}
                    className="w-full rounded-lg border border-[#1E2A3A] bg-[#111820] px-3 py-2 text-sm
                               text-white placeholder:text-gray-600 focus:outline-none
                               focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]/40 transition-colors"
                />
                <div>
                    <label className="text-xs text-gray-400 uppercase pb-2 block">Mô tả</label>
                    <textarea
                        placeholder="Nhập mô tả nhóm (không bắt buộc)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={5000}
                        rows={4}
                        className="w-full rounded-lg border border-[#1E2A3A] bg-[#111820] px-3 py-2 text-sm
                                   text-white placeholder:text-gray-600 focus:outline-none
                                   focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]/40 transition-colors"
                    />
                </div>
            </div>
        </TeamDialogForm>
    );
};