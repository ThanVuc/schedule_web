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

const COMPLETE_STATUS = 3;

export default function CompleteSprintDialog({
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

  const handleComplete = async () => {
    if (!target) return;
    setSubmitting(true);
    const { error } = await updateSprintStatusInGroupRequest(
      { status: COMPLETE_STATUS },
      `${target.id}/status`,
    );
    setSubmitting(false);
    if (error) {
      setToast({
        title: "Hoàn thành sprint thất bại",
        message: sprintApiToastMessage(error, "completeSprint", "Không thể hoàn thành sprint."),
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
            Hoàn thành Sprint
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Bạn có chắc muốn hoàn thành sprint này? Sprint sẽ được đánh
            dấu là hoàn thành và dữ liệu sẽ trở thành trạng thái chỉ đọc.
          </DialogDescription>
        </DialogHeader>
        <DialogBody />
        <DialogFooter>
          <DialogClose asChild>
            <DialogCancelButton disabled={submitting}>Hủy</DialogCancelButton>
          </DialogClose>
          <DialogPrimaryButton disabled={submitting} onClick={handleComplete}>
            Hoàn thành
          </DialogPrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
