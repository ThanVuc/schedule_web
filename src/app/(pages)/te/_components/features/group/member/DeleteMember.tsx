"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogCancelButton,
  DialogClose,
  DialogContent,
  DialogDangerButton,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../common/TeamDialog";
import type { DeleteMemberDialogProps, MemberToDelete } from "./memberTypes";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamGroupApiUrl } from "@/api/teamGroup";
import { memberApiToastMessage } from "./memberToastErrors";

export type { MemberToDelete };

export function DeleteMemberDialog({
  target,
  onOpenChange,
  groupId,
  onSuccess,
}: DeleteMemberDialogProps) {
  const { setToast } = useToastState();
  const [submitting, setSubmitting] = useState(false);
  const { sendRequest: removeMemberRequest } = useAxiosMutation({
    method: "DELETE",
    url: teamGroupApiUrl.list,
  });

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="text-white text-base">
            Xóa thành viên
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Bạn có chắc muốn xoá thành viên khỏi nhóm này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogBody />
        <DialogFooter>
          <DialogClose asChild>
            <DialogCancelButton disabled={submitting}>Hủy</DialogCancelButton>
          </DialogClose>
          <DialogDangerButton
            disabled={submitting}
            onClick={async () => {
              if (!target || !groupId) return;
              setSubmitting(true);

              const path = `${groupId}/members/${target.id}`;
              const { error } = await removeMemberRequest(undefined, path);

              setSubmitting(false);

              if (error) {
                setToast({
                  title: "Xóa thành viên thất bại",
                  message: memberApiToastMessage(
                    error,
                    "removeMember",
                    "Không thể xóa thành viên.",
                  ),
                  variant: "error",
                });
                return;
              }

              setToast({
                title: "Thành công",
                message: "Đã xóa thành viên khỏi nhóm.",
                variant: "success",
              });
              onSuccess?.();
              onOpenChange(false);
            }}
          >
            Xóa thành viên
          </DialogDangerButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

