"use client";

import React, { useState } from "react";
import { Zap } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogCancelButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPrimaryButton,
  DialogTitle,
  DialogClose,
} from "../../../../common/TeamDialog";
import { Button, Form, FormField, FormMessage, Textarea } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

type GenerateSprintWithAIFormData = {
  planningContext: string;
};

export default function GenerateSprintWithAIDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<"text" | "upload">("text");
  const GenerateSprintWithAISchema = z.object({
    planningContext: z.string().max(50000, "Nội dung vượt quá giới hạn cho phép"),
  });

  const form = useForm<GenerateSprintWithAIFormData>({
    resolver: zodResolver(GenerateSprintWithAISchema),
    defaultValues: { planningContext: "" },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader icon={<Zap size={18} className="text-[#F8AF18]" />}>
          <DialogTitle className="text-white text-base">
            Tạo Sprint với AI
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-xs">
            Cung cấp thông tin bối cảnh hoặc tải lên file kế hoạch.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <Form {...form}>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => setTab("text")}
                className={`h-10 rounded-md border hover:bg-[#2A3A4F] border-[#1E2A3A] text-sm font-medium transition-colors ${tab === "text"
                  ? "bg-[#2A3A4F] text-white"
                  : "bg-[#0D1520] text-gray-400 hover:text-white"
                  }`}
              >
                Nhập văn bản
              </Button>
              <Button
                type="button"
                onClick={() => setTab("upload")}
                className={`h-10 rounded-md border hover:bg-[#2A3A4F] border-[#1E2A3A] text-sm font-medium transition-colors ${tab === "upload"
                  ? "bg-[#2A3A4F] text-white"
                  : "bg-[#0D1520] text-gray-400 hover:text-white"
                  }`}
              >
                Tải lên file
              </Button>
            </div>

            {tab === "text" ? (
              <div className="space-y-3">
                <div className="text-xs text-gray-400 font-semibold">
                  Bối cảnh lập kế hoạch
                </div>

                <FormField
                  name="planningContext"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Textarea
                        {...field}
                        rows={10}
                        className="w-full h-45 resize-none rounded-lg border border-[#1E2A3A] bg-[#0D1520] text-white px-4 py-3 text-sm outline-none focus:border-[#42A5F5]/60"
                        placeholder="Dán tài liệu kế hoạch, yêu cầu hoặc mục tiêu của bạn vào đây..."
                      />
                      <FormMessage className="text-xs" />
                    </div>
                  )}
                />

                <div className="text-xs text-gray-500">
                  Bao gồm mục tiêu sprint, tính năng, nhiệm vụ hoặc bất kỳ thông tin lập kế hoạch nào.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-gray-400 font-semibold">
                  Tải lên tệp kế hoạch
                </div>
                <div className="rounded-lg border border-dashed border-[#1E2A3A] bg-[#0D1520] px-6 py-10 text-center">
                  <div className="flex justify-center mb-2">
                    <Zap size={20} className="text-[#F8AF18]" />
                  </div>
                  <div className="text-sm text-white font-semibold">
                    Tải lên tệp kế hoạch
                  </div>
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
          </Form>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <DialogCancelButton>Hủy</DialogCancelButton>
          </DialogClose>
          <DialogPrimaryButton
            onClick={form.handleSubmit(() => {
              onOpenChange(false);
            })}
          >
            Tạo sprints với AI
          </DialogPrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

