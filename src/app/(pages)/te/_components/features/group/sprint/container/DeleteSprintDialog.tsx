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
  DialogDangerButton,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../common/TeamDialog";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamSprintApiUrl } from "@/api/teamGroup";
import { sprintApiToastMessage } from "./sprintToastErrors";

export default function DeleteSprintDialog({
  target,
  onOpenChange,
  groupId,
  onSuccess,
}: SprintStatusMutationDialogProps) {
  const { setToast } = useToastState();
  const { sendRequest: deleteSprintInGroupRequest } = useAxiosMutation({
    method: "DELETE",
    url: teamSprintApiUrl.list(groupId),
  });
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!target) return;
    setSubmitting(true);
    const { error } = await deleteSprintInGroupRequest(undefined, target.id);
    setSubmitting(false);
    if (error) {
      setToast({
        title: "Xóa sprint thất bại",
        message: sprintApiToastMessage(error, "deleteSprint", "Không thể xóa sprint."),
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
            Xóa Sprint
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Bạn có chắc muốn xóa sprint này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogBody />
        <DialogFooter>
          <DialogClose asChild>
            <DialogCancelButton disabled={submitting}>Hủy</DialogCancelButton>
          </DialogClose>
          <DialogDangerButton disabled={submitting} onClick={handleDelete}>
            Xóa
          </DialogDangerButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
