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

export type { MemberToDelete };

export function DeleteMemberDialog({
  target,
  onOpenChange,
  groupId,
  onSuccess,
}: DeleteMemberDialogProps) {

  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="text-white text-base">
            Xóa thành viên
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Bạn có chắc muốn xóa
            {" "}
            <span className="font-medium text-gray-300">
              {target?.name}
            </span>
            {" "}
            khỏi nhóm này? Hành động này không thể hoàn tác.
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

              setSubmitting(false);
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

