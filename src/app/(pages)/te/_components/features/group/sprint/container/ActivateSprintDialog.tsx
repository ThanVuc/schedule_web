"use client";

import React, { useState } from "react";
import type { SprintStatusMutationDialogProps } from "../sprintTypes";
import {
  Dialog,
  DialogBody,
  DialogCancelButton,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPrimaryButton,
  DialogTitle,
} from "../../../../common/TeamDialog";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamSprintApiUrl } from "@/api/teamGroup";
import { sprintApiToastMessage } from "./sprintToastErrors";

const ACTIVE_STATUS = 2;

export default function ActivateSprintDialog({
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

  const handleActivate = async () => {
    if (!target) return;
    setSubmitting(true);
    const { error } = await updateSprintStatusInGroupRequest(
      { status: ACTIVE_STATUS },
      `${target.id}/status`,
    );
    setSubmitting(false);
    if (error) {
      setToast({
        title: "Kích hoạt sprint thất bại",
        message: sprintApiToastMessage(error, "activateSprint", "Không thể kích hoạt sprint."),
        variant: "error",
      });
      return;
    }
    setToast({ title: "Thành công", message: "Sprint đã được kích hoạt.", variant: "success" });
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="text-white text-base">
            Kích hoạt Sprint
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Sprint sẽ chuyển sang trạng thái Active và nhóm có thể bắt đầu làm việc
            trong khoảng thời gian đã đặt.
          </DialogDescription>
        </DialogHeader>
        <DialogBody />
        <DialogFooter>
          <DialogClose asChild>
            <DialogCancelButton disabled={submitting}>Hủy</DialogCancelButton>
          </DialogClose>
          <DialogPrimaryButton disabled={submitting} onClick={handleActivate}>
            Kích hoạt
          </DialogPrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
