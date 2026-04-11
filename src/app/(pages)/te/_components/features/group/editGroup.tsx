'use client';

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui";
import { TeamDialogForm } from "../../common/TeamDialog";
import { type Group } from "./types";
import { useAxios } from "@/hooks";
import { teamGroupApiUrl } from "@/api/teamGroup";

export interface EditGroupDialogProps {
    target: Group | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string, payload: { name?: string; description?: string }) => void;
}

export const EditGroupDialog = ({ target, onOpenChange, onConfirm }: EditGroupDialogProps) => {
    const [name, setName] = useState(target?.name ?? "");
    const [description, setDescription] = useState(target?.description ?? "");
    const [touched, setTouched] = useState(false);
    const [detailId, setDetailId] = useState<string>("");

    type GroupDetailApiModel = {
        id?: string;
        group_id?: string;
        name?: string;
        group_name?: string;
        description?: string | null;
    };
    useEffect(() => {
        setName(target?.name ?? "");
        setDescription(target?.description ?? "");
        setTouched(false);
        setDetailId(target?.id ?? "");
    }, [target]);

    const { data: groupDetailRaw, error: groupDetailError } = useAxios<GroupDetailApiModel | { group?: GroupDetailApiModel; item?: GroupDetailApiModel; data?: GroupDetailApiModel }>({
        method: "GET",
        url: teamGroupApiUrl.detail(detailId),
    }, [detailId], !target || !detailId);

    const groupDetail = ((): GroupDetailApiModel | null => {
        const raw = groupDetailRaw as any;
        if (!raw) return null;
        if (raw.name || raw.group_name || raw.description !== undefined) return raw as GroupDetailApiModel;
        if (raw.group) return raw.group as GroupDetailApiModel;
        if (raw.item) return raw.item as GroupDetailApiModel;
        if (raw.data && (raw.data.name || raw.data.group_name || raw.data.description !== undefined)) return raw.data as GroupDetailApiModel;
        return raw as GroupDetailApiModel;
    })();

    useEffect(() => {
        if (!target) return;
        const status = groupDetailError?.response?.status;
        if ((status === 404 || status === 422) && target.altGroupId && detailId !== target.altGroupId) {
            setDetailId(target.altGroupId);
        }
    }, [detailId, groupDetailError?.response?.status, target]);

    useEffect(() => {
        if (!target || touched || !groupDetail) return;
        const nextName = (groupDetail.name ?? groupDetail.group_name ?? "").trim();
        const nextDesc = (groupDetail.description ?? "").toString();
        if (nextName) setName(nextName);
        setDescription(nextDesc);
    }, [groupDetail, target, touched]);

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
                    onChange={(e) => {
                        setTouched(true);
                        setName(e.target.value);
                    }}
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
                        onChange={(e) => {
                            setTouched(true);
                            setDescription(e.target.value);
                        }}
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