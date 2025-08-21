"use client";

import { useState, useCallback } from "react";
import { AppAlertDialog } from "@/components/common";

export interface ConfirmDialogProps {
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  className?: string;
}

export function useConfirmDialog(
  {
    title = "Xác nhận",
    description = "Bạn có chắc chắn muốn tiếp tục?",
    submitText = "Đồng ý",
    cancelText = "Hủy bỏ",
    className = "",
  }: ConfirmDialogProps = {}
) {
  const [open, setOpen] = useState(false);
  const [promiseResolver, setPromiseResolver] = useState<(result: boolean) => void>();

  const confirm = useCallback(() => {
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setPromiseResolver(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    promiseResolver?.(false); 
  }, [promiseResolver]);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    promiseResolver?.(true); 
  }, [promiseResolver]);

  const dialog = (
    <AppAlertDialog
      className={className}
      open={open}
      setOpen={setOpen}
      onClose={handleClose}
      onSubmit={handleConfirm}
      title={title}
      description={description}
      submitText={submitText}
      cancelText={cancelText}
    />
  );

  return { confirm, dialog };
}
