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
  DialogFooter,
  DialogHeader,
  DialogPrimaryButton,
  DialogTitle,
} from "../../../../common/TeamDialog";

export default function CompleteSprintDialog({
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
            <DialogCancelButton>Hủy</DialogCancelButton>
          </DialogClose>
          <DialogPrimaryButton
            onClick={() => {
              if (!target) return;
              onConfirm(target.id);
            }}
          >
            Hoàn thành
          </DialogPrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

