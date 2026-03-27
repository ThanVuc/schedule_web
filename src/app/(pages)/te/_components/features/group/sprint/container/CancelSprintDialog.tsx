"use client";

import React from "react";
import type { Sprint } from "../sprintTypes";
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

export default function CancelSprintDialog({
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
            Hủy Sprint
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Bạn có chắc muốn hủy sprint này? Sprint sẽ được đánh dấu đã hủy và dữ liệu sẽ trở thành chỉ đọc.
          </DialogDescription>
        </DialogHeader>
        <DialogBody />
        <DialogFooter>
          <DialogClose asChild>
            <DialogCancelButton>Thoát</DialogCancelButton>
          </DialogClose>
          <DialogDangerButton
            onClick={() => {
              if (!target) return;
              onConfirm(target.id);
            }}
          >
            Hủy
          </DialogDangerButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

