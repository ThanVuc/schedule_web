"use client";

import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { TeamDialogForm } from "../../../../common/TeamDialog";
import { Button, Textarea } from "@/components/ui";
import z from "zod";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamSprintApiUrl } from "@/api/teamGroup";
import type {
  GenerateSprintAiTab,
  GenerateSprintWithAIFormData,
  GenerateSprintWithAIDialogProps,
} from "../sprintTypes";
import { sprintApiToastMessage } from "./sprintToastErrors";

const GenerateSprintWithAISchema = z.object({
  planningContext: z.string().max(5000, "Nội dung vượt quá giới hạn cho phép"),
});

const INITIAL: GenerateSprintWithAIFormData = { tab: "text", planningContext: "" };

export default function GenerateSprintWithAIDialog({
  open,
  onOpenChange,
  groupId,
  onSuccess,
}: GenerateSprintWithAIDialogProps) {
  const { setToast } = useToastState();
  const { sendRequest: generateSprintRequest } = useAxiosMutation({
    method: "POST",
    url: teamSprintApiUrl.generation(groupId),
  });
  const [data, setData] = useState<GenerateSprintWithAIFormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setData(INITIAL);
  }, [open]);

  const setTab = (tab: GenerateSprintAiTab) => setData((prev) => ({ ...prev, tab }));
  const setPlanningContext = (planningContext: string) =>
    setData((prev) => ({ ...prev, planningContext }));

  return (
    <TeamDialogForm
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      icon={<Zap size={18} className="text-[#F8AF18]" />}
      title="Tạo Sprint với AI"
      description="Cung cấp thông tin bối cảnh hoặc tải lên file kế hoạch."
      warnOnClose={data.planningContext.trim().length > 0}
      submitDisabled={
        submitting || (data.tab === "text" && !GenerateSprintWithAISchema.safeParse(data).success)
      }
      submitButtonText="Tạo sprint với AI"
      cancelButtonText="Hủy"
      onSubmit={async () => {
        setSubmitting(true);
        const { error } = await generateSprintRequest({ planning_context: data.planningContext.trim() });
        setSubmitting(false);
        if (error) {
          setToast({
            title: "Tạo sprint AI thất bại",
            message: sprintApiToastMessage(error, "generateSprintAi", "Không thể tạo sprint bằng AI."),
            variant: "error",
          });
          return;
        }
        setToast({ title: "Đang xử lý", message: "AI đang xử lý yêu cầu tạo sprint.", variant: "default" });
        onSuccess?.();
        onOpenChange(false);
      }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            onClick={() => setTab("text")}
            className={`h-10 rounded-md border hover:bg-[#2A3A4F] border-[#1E2A3A] text-sm font-medium transition-colors ${data.tab === "text"
              ? "bg-[#2A3A4F] text-white"
              : "bg-[#0D1520] text-gray-400 hover:text-white"
              }`}
          >
            Nhập văn bản
          </Button>
          <Button
            type="button"
            onClick={() => setTab("upload")}
            className={`h-10 rounded-md border hover:bg-[#2A3A4F] border-[#1E2A3A] text-sm font-medium transition-colors ${data.tab === "upload"
              ? "bg-[#2A3A4F] text-white"
              : "bg-[#0D1520] text-gray-400 hover:text-white"
              }`}
          >
            Tải lên file
          </Button>
        </div>

        {data.tab === "text" ? (
          <div className="space-y-3">
            <div className="text-xs text-gray-400 font-semibold">Bối cảnh lập kế hoạch</div>
            <Textarea
              rows={10}
              className="w-full h-45 resize-none rounded-lg border border-[#1E2A3A] bg-[#0D1520] text-white px-4 py-3 text-sm outline-none focus:border-[#42A5F5]/60"
              placeholder="Dán tài liệu kế hoạch, yêu cầu hoặc mục tiêu của bạn vào đây..."
              value={data.planningContext}
              onChange={(e) => setPlanningContext(e.target.value)}
            />
            <div className="text-xs text-gray-500">
              Bao gồm mục tiêu sprint, tính năng, nhiệm vụ hoặc bất kỳ thông tin lập kế hoạch nào.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-gray-400 font-semibold">Tải lên tệp kế hoạch</div>
            <div className="rounded-lg border border-dashed border-[#1E2A3A] bg-[#0D1520] px-6 py-10 text-center">
              <div className="flex justify-center mb-2">
                <Zap size={20} className="text-[#F8AF18]" />
              </div>
              <div className="text-sm text-white font-semibold">Tải lên tệp kế hoạch</div>
              <div className="text-xs text-gray-500 mt-1">
                Hỗ trợ các định dạng tài liệu TXT, PDF, DOC.
              </div>
              <div className="mt-5">
                <Button
                  type="button"
                  className="bg-[#2A3A4F] inline-flex items-center h-9 rounded-lg border border-[#1E2A3A] px-4 text-sm font-semibold text-gray-300 hover:bg-[#1E2A3A]"
                >
                  Chọn File
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeamDialogForm>
  );
}