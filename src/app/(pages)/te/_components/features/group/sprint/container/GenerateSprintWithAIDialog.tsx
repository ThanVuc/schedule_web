"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { TeamDialogForm } from "../../../../common/TeamDialog";
import { Form } from "@/components/ui";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { teamSprintApiUrl } from "@/api/teamGroup";
import {
  normalizeDateToApiIso,
  SprintAiGenerationRequestSchema,
  type SprintAiGenerationRequest,
} from "../../../../../_models/sprints/schema/sprint.schema";
import type { GenerateSprintWithAIDialogProps } from "../sprintTypes";
import { sprintApiToastMessage } from "./sprintToastErrors";
import AISprintAdditionalForm from "../components/AISprintAdditionalForm";
import UploadFileForm, { type UploadFileFormRef } from "../components/UploadFileForm";
import ExportTemplate from "../components/ExportTemplate";

const initialFormValues: SprintAiGenerationRequest = {
  name: "",
  goal: "",
  start_date: "",
  end_date: "",
  additional_context: "",
  files: [],
};

export default function GenerateSprintWithAIDialog({
  open,
  onOpenChange,
  groupId,
  onSuccess,
}: GenerateSprintWithAIDialogProps) {
  const { setToast } = useToastState();
  const uploadFormRef = useRef<UploadFileFormRef>(null);
  const { sendRequest: generateSprintRequest } = useAxiosMutation<unknown, SprintAiGenerationRequest>({
    method: "POST",
    url: teamSprintApiUrl.generation(groupId),
  });

  const [submitting, setSubmitting] = useState(false);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [hasSelectedUploadFiles, setHasSelectedUploadFiles] = useState(false);

  const form = useForm<SprintAiGenerationRequest>({
    resolver: zodResolver(SprintAiGenerationRequestSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(initialFormValues);
    setActiveError(null);
    setHasSelectedUploadFiles(false);
    uploadFormRef.current?.resetSelection();
  }, [open, form]);

  const watchedValues = form.watch();
  const warnOnClose = useMemo(() => {
    const hasInputValues =
      watchedValues.name.trim().length > 0 ||
      watchedValues.goal.trim().length > 0 ||
      watchedValues.start_date.trim().length > 0 ||
      watchedValues.end_date.trim().length > 0 ||
      watchedValues.additional_context.trim().length > 0;

    return hasInputValues || hasSelectedUploadFiles;
  }, [watchedValues, hasSelectedUploadFiles]);

  const submitDisabled = submitting || !form.formState.isValid;

  const onSubmit = async (values: SprintAiGenerationRequest) => {
    setSubmitting(true);
    setActiveError(null);

    try {
      let files = values.files;
      if (uploadFormRef.current?.hasSelectedFiles()) {
        const uploadedFiles = await uploadFormRef.current.uploadFiles();
        files = uploadedFiles.map((item) => ({
          object_key: item.object_key,
          size: item.size,
        }));
      } else {
        files = [];
      }

      const payload = SprintAiGenerationRequestSchema.parse({
        ...values,
        start_date: normalizeDateToApiIso(values.start_date),
        end_date: normalizeDateToApiIso(values.end_date),
        files,
      });

      form.setValue("files", payload.files, { shouldValidate: true });
      const { error } = await generateSprintRequest(payload);
      if (error) {
        setToast({
          title: "Tạo sprint AI thất bại",
          message: sprintApiToastMessage(error, "generateSprintAi", "Không thể tạo sprint bằng AI."),
          variant: "error",
        });
        return;
      }

      setToast({
        title: "Đang xử lý",
        message: "AI đang xử lý yêu cầu tạo sprint.",
        variant: "default",
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể tải tệp hoặc tạo sprint bằng AI.";
      setActiveError(message);
      setToast({
        title: "Tạo sprint AI thất bại",
        message,
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TeamDialogForm
      scroll
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      icon={<Zap size={18} className="text-[#F8AF18]" />}
      title="Tạo Sprint với AI"
      description="Cung cấp thông tin bối cảnh hoặc tải lên file kế hoạch."
      warnOnClose={warnOnClose}
      submitDisabled={submitDisabled}
      submitButtonText="Tạo sprint với AI"
      cancelButtonText="Hủy"
      onSubmit={() => form.handleSubmit(onSubmit)()}
    >
      <Form {...form}>
        <div className="space-y-4">
          {activeError ? <div className="text-xs text-red-400">{activeError}</div> : null}

          <AISprintAdditionalForm form={form} />

          <UploadFileForm
            ref={uploadFormRef}
            onSelectionChange={setHasSelectedUploadFiles}
            onUploaded={(uploadedFiles) => {
              form.setValue(
                "files",
                uploadedFiles.map((item) => ({
                  object_key: item.object_key,
                  size: item.size,
                })),
                { shouldValidate: true },
              );
            }}
          />
          <ExportTemplate />
        </div>
      </Form>
    </TeamDialogForm>
  );
}
