import { z } from "zod";
import { DateOnly } from "../../../_types/DateOnly";
import { normalizeDateToIso, toIsoDateString } from "../../../_utils";

export const SPRINT_AI_MAX_FILES = 3;
export const SPRINT_AI_MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

export const SPRINT_AI_ALLOWED_EXTENSIONS = [
	".md",
    ".markdown",
	".pdf",
	".doc",
	".docx",
	".xls",
	".xlsx",
] as const;

export const SPRINT_AI_FILE_ACCEPT = SPRINT_AI_ALLOWED_EXTENSIONS.join(",");

const DateOnlyStringSchema = z
	.string()
	.refine((value) => value.trim().length > 0, {
		message: "Ngày không được để trống",
	})
	.refine((value) => {
		return tryParseDateOnly(value) !== null;
	}, "Ngày không hợp lệ. Vui lòng dùng định dạng dd/mm/yyyy");

function tryParseDateOnly(value: string): DateOnly | null {
	const isoDate = toIsoDateString(value);
	if (!isoDate) {
		return null;
	}

	return DateOnly.fromString(isoDate);
}

export function normalizeDateToApiIso(value: string): string {
	return normalizeDateToIso(value);
}

export function normalizeIsoDateToHandlerDate(value: string): string {
	return normalizeDateToApiIso(value);
}

export const SprintAiFileItemSchema = z.object({
	object_key: z.string().trim().min(1),
	size: z.number().int().positive().max(SPRINT_AI_MAX_FILE_SIZE_BYTES),
});

export const SprintAiGenerationRequestSchema = z
	.object({
		name: z.string().trim().min(1, "Tên sprint là bắt buộc"),
		goal: z.string().trim().min(1, "Mục tiêu sprint là bắt buộc"),
		start_date: DateOnlyStringSchema,
		end_date: DateOnlyStringSchema,
		additional_context: z.string().trim().max(2000),
		files: z.array(SprintAiFileItemSchema).max(SPRINT_AI_MAX_FILES),
	})
	.superRefine((value, ctx) => {
		const startDate = tryParseDateOnly(value.start_date);
		const endDate = tryParseDateOnly(value.end_date);
		if (!startDate || !endDate) {
			return;
		}

		if (!startDate.isBefore(endDate)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
				path: ["end_date"],
			});
		}
	});

export const SprintAiPresignRequestSchema = z.object({
	files: z
		.array(
			z.object({
				index: z.number().int().nonnegative(),
				content_type: z.string().trim().min(1),
				file_name: z.string().trim().min(1),
			}),
		)
		.min(1)
		.max(SPRINT_AI_MAX_FILES),
});

export const SprintAiPresignResponseSchema = z.object({
	items: z
		.array(
			z.object({
				index: z.number().int().nonnegative(),
				presigned_url: z.string().url(),
			}),
		)
		.min(1),
});

const SprintAiUploadFileSchema = z
	.custom<File>((value) => value instanceof File, "Tệp không hợp lệ")
	.refine((file) => isAllowedSprintAiFile(file), {
		message: "Chỉ hỗ trợ .md, .pdf, .doc, .docx, .xls, .xlsx.",
	})
	.refine((file) => file.size <= SPRINT_AI_MAX_FILE_SIZE_BYTES, {
		message: "Mỗi tệp phải nhỏ hơn 4MB.",
	});

export const SprintAiUploadSelectionSchema = z
	.array(SprintAiUploadFileSchema)
	.max(SPRINT_AI_MAX_FILES, "Bạn chỉ có thể tải lên tối đa 3 tệp.");

export type SprintAiGenerationRequest = z.infer<typeof SprintAiGenerationRequestSchema>;
export type SprintAiFileItem = z.infer<typeof SprintAiFileItemSchema>;
export type SprintAiPresignRequest = z.infer<typeof SprintAiPresignRequestSchema>;
export type SprintAiPresignResponse = z.infer<typeof SprintAiPresignResponseSchema>;

export function isAllowedSprintAiFile(file: File): boolean {
	const lowerName = file.name.toLowerCase();
	return SPRINT_AI_ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}
