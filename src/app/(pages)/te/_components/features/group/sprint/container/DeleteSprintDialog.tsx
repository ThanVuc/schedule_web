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

export type DeleteSprintMode = "sprintOnly" | "sprintAndWorks";

export default function DeleteSprintDialog({
  target,
  onOpenChange,
  groupId,
  onSuccess,
  mode = "sprintOnly",
}: SprintStatusMutationDialogProps & { mode?: DeleteSprintMode }) {
  const { setToast } = useToastState();
  const { sendRequest: deleteSprintOnlyRequest } = useAxiosMutation({
    method: "DELETE",
    url: teamSprintApiUrl.deleteInGroup(groupId, target?.id ?? ""),
  });
  const { sendRequest: deleteSprintAndWorksRequest } = useAxiosMutation({
    method: "DELETE",
    url: teamSprintApiUrl.deleteDrafts(groupId, target?.id ?? ""),
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const expectedName = target?.name?.trim() ?? "";
  const canDelete = confirmName.trim() === expectedName && expectedName.length > 0 && !submitting;

  useEffect(() => {
    if (target) setConfirmName("");
  }, [target]);

  const handleDelete = async () => {
    if (!target || !canDelete) return;
    setSubmitting(true);
    const { error } = mode === "sprintAndWorks"
      ? await deleteSprintAndWorksRequest()
      : await deleteSprintOnlyRequest();
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
            {mode === "sprintAndWorks" ? "Xóa Sprint và công việc" : "Xóa Sprint"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            {mode === "sprintAndWorks"
              ? "Bạn có chắc muốn xóa sprint này và toàn bộ công việc bên trong? Hành động này không thể hoàn tác."
              : "Bạn có chắc muốn xóa sprint này? Hành động này không thể hoàn tác."}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-3">
            <p className="text-sm text-gray-300 leading-relaxed">
              Nhập chính xác tên sprint <span className="font-semibold text-white">{target?.name}</span> để xác nhận xóa.
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
            <DialogCancelButton disabled={submitting} onClick={() => setConfirmName("")}>Hủy</DialogCancelButton>
          </DialogClose>
          <DialogDangerButton disabled={!canDelete} onClick={handleDelete}>
            Xóa
          </DialogDangerButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
