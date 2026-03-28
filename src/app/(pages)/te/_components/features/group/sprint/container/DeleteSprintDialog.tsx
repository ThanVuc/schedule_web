"use client";

import React from "react";
import type { Sprint } from "../sprintTypes";
import {
  Dialog, DialogBody, DialogCancelButton, DialogClose, DialogContent, DialogDescription, DialogDangerButton, DialogFooter, DialogHeader, DialogTitle,
} from "../../../../common/TeamDialog";

export default function DeleteSprintDialog({
  target,
  onOpenChange,
  onConfirm,
}: {
  target: Sprint | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}) {
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
            <DialogCancelButton>Hủy</DialogCancelButton>
          </DialogClose>
          <DialogDangerButton
            onClick={() => {
              if (!target) return;
              onConfirm(target.id);
            }}
          >
            Xóa
          </DialogDangerButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

