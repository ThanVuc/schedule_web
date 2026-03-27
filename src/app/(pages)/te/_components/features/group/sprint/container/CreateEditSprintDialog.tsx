"use client";

import React, { useEffect } from "react";
import type { SprintFormData } from "../sprintTypes";
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
import { Form } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import CreateEditSprintForm from "../components/CreateEditSprintForm";

export default function CreateEditSprintDialog({
  open,
  onOpenChange,
  initialData,
  onConfirm,
  mode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SprintFormData;
  onConfirm: (data: SprintFormData) => void;
  mode: "create" | "edit";
}) {
  const EMPTY: SprintFormData = {
    name: "",
    startDate: "",
    endDate: "",
  };

  const SprintSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, "Tên sprint không được để trống")
      .max(200, "Tên sprint không thể vượt quá 200 ký tự"),
    startDate: z
      .string()
      .trim()
      .min(1, "Ngày bắt đầu không được để trống"),
    endDate: z.string().trim().min(1, "Ngày kết thúc không được để trống"),
  });

  const form = useForm<SprintFormData>({
    resolver: zodResolver(SprintSchema),
    defaultValues: initialData ?? EMPTY,
  });

  useEffect(() => {
    if (open) form.reset(initialData ?? EMPTY);
  }, [open, initialData, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="text-white text-base">
            {mode === "create" ? "Tạo Sprint" : "Chỉnh sửa Sprint"}
          </DialogTitle>
          {mode === "create" && (
            <DialogDescription className="text-gray-500 text-xs">
              Tạo một sprint mới để nhóm bạn bắt đầu làm việc.
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogBody className="flex flex-col gap-4">
          <Form {...form}>
            <CreateEditSprintForm form={form} />
          </Form>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <DialogCancelButton>Hủy</DialogCancelButton>
          </DialogClose>

          <DialogPrimaryButton
            disabled={!form.formState.isValid}
            onClick={form.handleSubmit((data) => onConfirm(data))}
          >
            {mode === "create" ? "Tạo Sprint" : "Lưu thay đổi"}
          </DialogPrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

