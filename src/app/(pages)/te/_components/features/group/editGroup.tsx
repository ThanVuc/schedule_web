'use client';

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui";
import { TeamDialogForm } from "../../common/TeamDialog";
import { type Group } from "./types";

export interface EditGroupDialogProps {
    target: Group | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string, payload: { name?: string; description?: string }) => void;
}

export const EditGroupDialog = ({ target, onOpenChange, onConfirm }: EditGroupDialogProps) => {
    const [name, setName] = useState(target?.name ?? "");
    const [description, setDescription] = useState(target?.description ?? "");

    // Đồng bộ khi target thay đổi (dialog mở với group khác)
    useEffect(() => {
        setName(target?.name ?? "");
        setDescription(target?.description ?? "");
    }, [target]);

    const isUnchanged =
        name.trim() === (target?.name ?? "") &&
        description.trim() === (target?.description ?? "");

    return (
        <TeamDialogForm
            open={!!target}
            onOpenChange={onOpenChange}
            size="md"
            title="Chỉnh sửa nhóm"
            description="Cập nhật thông tin nhóm của bạn."
            warnOnClose={!!target && !isUnchanged}
            submitDisabled={!target || name.trim().length === 0 || isUnchanged}
            submitConfirm
            submitButtonText="Lưu thay đổi"
            cancelButtonText="Thoát"
            onSubmit={() => {
                if (!target) return;
                onConfirm(target.id, {
                    name: name.trim(),
                    description: description.trim() || undefined,
                });
            }}
        >
            <div className="space-y-4">
                <label className="text-xs text-gray-400 uppercase pb-2 block">Tên nhóm</label>
                <Input
                    type="text"
                    placeholder="Nhập tên nhóm"
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