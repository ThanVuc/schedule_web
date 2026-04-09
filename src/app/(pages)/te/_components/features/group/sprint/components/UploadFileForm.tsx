"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import axios from "axios";
import { Zap } from "lucide-react";
import { teamSprintApiUrl } from "@/api/teamGroup";
import { getMimeTypeFromFile } from "@/app/(pages)/te/_utils";
import { useAxiosMutation } from "@/hooks/useAxios";
import { useToastState } from "@/hooks/useToasts";
import { Button, Input } from "@/components/ui";
import {
	SPRINT_AI_FILE_ACCEPT,
	SprintAiFileItemSchema,
	SprintAiPresignRequestSchema,
	SprintAiUploadSelectionSchema,
	type SprintAiFileItem,
	type SprintAiPresignRequest,
	type SprintAiPresignResponse,
} from "../../../../../_models/sprints/schema/sprint.schema";
import {
	SprintAiFileMetadataModel,
	SprintAiPresignResponseModel,
} from "../../../../../_models/sprints/model/sprint.model";

export interface UploadFileFormRef {
	uploadFiles: () => Promise<SprintAiFileMetadataModel[]>;
	hasSelectedFiles: () => boolean;
	resetSelection: () => void;
}

interface UploadFileFormProps {
	onSelectionChange?: (hasSelectedFiles: boolean) => void;
	onUploaded?: (files: SprintAiFileMetadataModel[]) => void;
}

function extractObjectKeyFromPresignedUrl(presignedUrl: string): string {
	const decodedPath = decodeURIComponent(new URL(presignedUrl).pathname);
	const segments = decodedPath.split("/").filter(Boolean);
	if (segments.length <= 1) {
		return segments.join("/");
	}

	return segments.slice(1).join("/");
}

const UploadFileForm = forwardRef<UploadFileFormRef, UploadFileFormProps>(
	({ onSelectionChange, onUploaded }, ref) => {
		const { setToast } = useToastState();
		const { sendRequest: getPresignedUrls } = useAxiosMutation<
			SprintAiPresignResponse,
			SprintAiPresignRequest
		>({
			method: "POST",
			url: teamSprintApiUrl.generationPresign(),
		});

		const [files, setFiles] = useState<File[]>([]);
		const [uploading, setUploading] = useState(false);
		const [uploadProgress, setUploadProgress] = useState({ total: 0, done: 0 });

		useEffect(() => {
			onSelectionChange?.(files.length > 0);
		}, [files, onSelectionChange]);

		const displayProgress = useMemo(
			() => (uploading && uploadProgress.total > 0 ? `${uploadProgress.done}/${uploadProgress.total}` : null),
			[uploading, uploadProgress],
		);

		const onSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
			const incomingFiles = Array.from(event.target.files ?? []);
			if (!incomingFiles.length) {
				return;
			}

			const mergedFiles = [...files, ...incomingFiles];
			const parsedFiles = SprintAiUploadSelectionSchema.safeParse(mergedFiles);
			if (!parsedFiles.success) {
				setToast({
					title: "Không thể chọn tệp",
					message: parsedFiles.error.issues[0]?.message ?? "Dữ liệu tệp không hợp lệ.",
					variant: "error",
				});
				event.target.value = "";
				return;
			}

			setFiles(parsedFiles.data);
			event.target.value = "";
		};

		const onRemoveFile = (index: number) => {
			setFiles((previousFiles) => previousFiles.filter((_, fileIndex) => fileIndex !== index));
		};

		const uploadFiles = async (): Promise<SprintAiFileMetadataModel[]> => {
			if (!files.length) {
				throw new Error("Bạn cần tải lên ít nhất 1 tệp.");
			}

			const presignPayload = SprintAiPresignRequestSchema.parse({
				files: files.map((file, index) => ({
					index,
					content_type: getMimeTypeFromFile(file),
					file_name: file.name,
				})),
			});

			setUploading(true);
			setUploadProgress({ total: files.length, done: 0 });

			try {
				const { data, error } = await getPresignedUrls(presignPayload);
				if (error || !data) {
					throw new Error("Không thể lấy presigned URL để tải tệp.");
				}

				const presignModel = SprintAiPresignResponseModel.fromApi(data);
				const presignedByIndex = new Map(
					presignModel.items.map((item) => [item.index, item.presigned_url]),
				);

				const uploadedMetadata: SprintAiFileMetadataModel[] = [];
				for (let index = 0; index < files.length; index += 1) {
					const file = files[index];
					const presignedUrl = presignedByIndex.get(index);
					if (!presignedUrl) {
						throw new Error(`Không tìm thấy presigned URL tại vị trí ${index}.`);
					}

					await axios.put(presignedUrl, file, {
						headers: {
							"Content-Type": getMimeTypeFromFile(file),
						},
					});

					const parsedMetadata: SprintAiFileItem = SprintAiFileItemSchema.parse({
						object_key: extractObjectKeyFromPresignedUrl(presignedUrl),
						size: file.size,
					});
					uploadedMetadata.push(SprintAiFileMetadataModel.fromSchema(parsedMetadata));
					setUploadProgress((previousProgress) => ({
						...previousProgress,
						done: previousProgress.done + 1,
					}));
				}

				onUploaded?.(uploadedMetadata);
				return uploadedMetadata;
			} finally {
				setUploading(false);
			}
		};

		const resetSelection = () => {
			setFiles([]);
			setUploadProgress({ total: 0, done: 0 });
		};

		useImperativeHandle(ref, () => ({
			uploadFiles,
			hasSelectedFiles: () => files.length > 0,
			resetSelection,
		}));

		return (
			<div className="space-y-3">
				<div className="text-xs text-gray-400 font-semibold">Tải lên tệp kế hoạch</div>
				<div className="rounded-lg border border-dashed border-[#1E2A3A] bg-[#0D1520] px-6 py-10 text-center">
					<div className="flex justify-center mb-2">
						<Zap size={20} className="text-[#F8AF18]" />
					</div>
					<div className="text-sm text-white font-semibold">Tải lên tệp kế hoạch</div>
					<div className="text-xs text-gray-500 mt-1">
						Hỗ trợ .md, .pdf, .doc, .docx, .xls, .xlsx. Tối đa 3 tệp, mỗi tệp nhỏ hơn 4MB.
					</div>
					<div className="mt-5">
						<Input
							id="sprint-ai-file-upload"
							type="file"
							multiple
							accept={SPRINT_AI_FILE_ACCEPT}
							className="hidden"
							onChange={onSelectFiles}
						/>
						<Button
							type="button"
							onClick={() => {
								const input = document.getElementById("sprint-ai-file-upload");
								if (input instanceof HTMLInputElement) {
									input.click();
								}
							}}
							className="bg-[#2A3A4F] inline-flex items-center h-9 rounded-lg border border-[#1E2A3A] px-4 text-sm font-semibold text-gray-300 hover:bg-[#1E2A3A]"
						>
							Chọn File
						</Button>
					</div>
				</div>

				{files.length > 0 ? (
					<div className="space-y-2">
						{files.map((file, index) => (
							<div
								key={`${file.name}-${index}`}
								className="flex items-center justify-between rounded-md border border-[#1E2A3A] bg-[#101B29] px-3 py-2"
							>
								<div className="min-w-0">
									<div className="truncate text-sm text-gray-200">{file.name}</div>
									<div className="text-xs text-gray-500">{Math.ceil(file.size / 1024)} KB</div>
								</div>
								<Button
									type="button"
									onClick={() => onRemoveFile(index)}
									disabled={uploading}
									className="h-7 rounded-md border border-[#334155] bg-transparent px-2 text-xs text-gray-300 hover:bg-[#1E2A3A]"
								>
									Xóa
								</Button>
							</div>
						))}
					</div>
				) : null}

				{displayProgress ? (
					<div className="text-xs text-gray-400">Đang tải lên: {displayProgress} tệp</div>
				) : null}
			</div>
		);
	},
);

UploadFileForm.displayName = "UploadFileForm";

export default UploadFileForm;
