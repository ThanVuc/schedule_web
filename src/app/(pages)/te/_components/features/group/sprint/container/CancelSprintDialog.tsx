"use client";

import React, { useEffect, useState } from "react";
import type { SprintStatusMutationDialogProps } from "../sprintTypes";
import {
  Dialog,
  DialogBody,
  DialogCancelButton,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogDangerButton,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../common/TeamDialog";
import { Input } from "@/components/ui";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamSprintApiUrl } from "@/api/teamGroup";
import { sprintApiToastMessage } from "./sprintToastErrors";

const CANCEL_STATUS = 4;

export default function CancelSprintDialog({
  target,
  onOpenChange,
  groupId,
  onSuccess,
}: SprintStatusMutationDialogProps) {
  const { setToast } = useToastState();
  const { sendRequest: updateSprintStatusInGroupRequest } = useAxiosMutation({
    method: "PATCH",
    url: teamSprintApiUrl.list(groupId),
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const expectedName = target?.name?.trim() ?? "";
  const canCancel = confirmName.trim() === expectedName && expectedName.length > 0 && !submitting;

  useEffect(() => {
    if (target) setConfirmName("");
  }, [target]);

  const handleCancel = async () => {
    if (!target || !canCancel) return;
    setSubmitting(true);
    const { error } = await updateSprintStatusInGroupRequest(
      { status: CANCEL_STATUS },
      `${target.id}/status`,
    );
    setSubmitting(false);
    if (error) {
      setToast({
        title: "Hủy sprint thất bại",
        message: sprintApiToastMessage(error, "cancelSprint", "Không thể hủy sprint."),
        variant: "error",
      });
      return;
    }
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="text-white text-base">
            Hủy Sprint
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Bạn có chắc muốn hủy sprint này? Sprint sẽ được đánh dấu đã hủy và dữ liệu sẽ trở thành chỉ đọc.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <p className="text-sm text-gray-300 leading-relaxed">
              Nhập chính xác tên sprint <span className="font-semibold text-white">{target?.name}</span> để xác nhận hủy.
            </p>
            <Input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={expectedName || "Tên sprint"}
              className="w-full bg-[#0D1520] border border-[#1E2A3A] text-white"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <DialogCancelButton disabled={submitting} onClick={() => setConfirmName("")}>Thoát</DialogCancelButton>
          </DialogClose>
          <DialogDangerButton disabled={!canCancel} onClick={handleCancel}>
            Hủy
          </DialogDangerButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
