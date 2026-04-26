"use client";

import React, { useState, useEffect } from "react";
import type { CreateEditSprintDialogProps, Sprint, SprintFormData } from "../sprintTypes";
import { TeamDialogForm } from "../../../../common/TeamDialog";
import z from "zod";
import CreateEditSprintForm from "../components/CreateEditSprintForm";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamSprintApiUrl } from "@/api/teamGroup";
import { sprintApiToastMessage } from "./sprintToastErrors";

const SprintSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên sprint không được để trống")
    .max(200, "Tên sprint không thể vượt quá 200 ký tự"),
  goal: z
    .string()
    .trim()
    .min(1, "Mục tiêu sprint không được để trống")
    .max(5000, "Mục tiêu sprint không thể vượt quá 5000 ký tự"),
  startDate: z.string().trim().min(1, "Ngày bắt đầu không được để trống"),
  endDate: z.string().trim().min(1, "Ngày kết thúc không được để trống"),
}).superRefine((data, ctx) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (Number.isNaN(start.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["startDate"],
      message: "Ngày bắt đầu không hợp lệ",
    });
    return;
  }

  if (Number.isNaN(end.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endDate"],
      message: "Ngày kết thúc không hợp lệ",
    });
    return;
  }

  // Check if start date is in the past (before today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (start < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["startDate"],
      message: "Ngày bắt đầu không được trong quá khứ",
    });
    return;
  }

  if (end < start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endDate"],
      message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
    });
    return;
  }

  const DAY_MS = 24 * 60 * 60 * 1000;
  const durationDays = Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1;
  if (durationDays > 30) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endDate"],
      message: "Thời lượng sprint không được vượt quá 30 ngày",
    });
  }
});

const EMPTY: SprintFormData = { name: "", goal: "", startDate: "", endDate: "" };

export default function CreateEditSprintDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
  mode,
  groupId,
  editTarget,
}: CreateEditSprintDialogProps) {
  const { setToast } = useToastState();
  const { sendRequest: createSprintRequest } = useAxiosMutation({
    method: "POST",
    url: teamSprintApiUrl.create(groupId),
  });
  const { sendRequest: updateSprintInGroupRequest } = useAxiosMutation({
    method: "PATCH",
    url: teamSprintApiUrl.list(groupId),
  });
  const baseData = initialData ?? EMPTY;
  const [data, setData] = useState<SprintFormData>(baseData);

  useEffect(() => {
    if (open) setData(initialData ?? EMPTY);
  }, [open, initialData]);

  const isUnchanged =
    data.name === baseData.name &&
    data.goal === baseData.goal &&
    data.startDate === baseData.startDate &&
    data.endDate === baseData.endDate;

  return (
    <TeamDialogForm
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={mode === "create" ? "Tạo Sprint" : "Chỉnh sửa Sprint"}
      description={mode === "create" ? "Tạo một sprint mới để nhóm bạn bắt đầu làm việc." : undefined}
      warnOnClose={!isUnchanged}
      submitDisabled={!SprintSchema.safeParse(data).success}
      submitButtonText={mode === "create" ? "Tạo Sprint" : "Lưu thay đổi"}
      cancelButtonText="Hủy"
      onSubmit={async () => {
        if (mode === "create") {
          const { error } = await createSprintRequest({
            name: data.name,
            goal: data.goal,
            start_date: data.startDate,
            end_date: data.endDate,
          });
          if (error) {
            setToast({
              title: "Tạo sprint thất bại",
              message: sprintApiToastMessage(error, "createEditSprint", "Không thể tạo sprint mới."),
              variant: "error",
            });
            return;
          }
          onSuccess?.();
          onOpenChange(false);
          return;
        }
        const target = editTarget as Sprint | null | undefined;
        if (!target) return;
        const payload = {
          name: data.name,
          goal: data.goal,
          start_date: data.startDate,
          end_date: data.endDate,
        };
        const { error } = await updateSprintInGroupRequest(payload, target.id);
        if (error) {
          setToast({
            title: "Cập nhật sprint thất bại",
            message: sprintApiToastMessage(error, "createEditSprint", "Không thể cập nhật sprint."),
            variant: "error",
          });
          return;
        }
        onSuccess?.();
        onOpenChange(false);
      }}
    >
      <CreateEditSprintForm data={data} setData={setData} />
    </TeamDialogForm>
  );
}