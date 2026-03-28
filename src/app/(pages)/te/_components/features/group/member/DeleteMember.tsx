"use client";

import React from "react";
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
import type { MemberRole } from "./ChangeRole";

export interface MemberToDelete {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
}

export function DeleteMemberDialog({
  target,
  onOpenChange,
  onConfirm,
}: {
  target: MemberToDelete | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}) {
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
            <DialogCancelButton>Hủy</DialogCancelButton>
          </DialogClose>
          <DialogDangerButton
            onClick={() => {
              if (!target) return;
              onConfirm(target.id);
            }}
          >
            Xóa thành viên
          </DialogDangerButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

