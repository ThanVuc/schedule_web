import type { AxiosError } from "axios";
import type { SprintApiErrorBody, SprintToastErrorContext } from "../sprintTypes";

export type { SprintToastErrorContext };

const MSG_404_SPRINT =
  "Không tìm thấy sprint hoặc bạn không có quyền thực hiện thao tác này.";
const MSG_404_GROUP_AI =
  "Không tìm thấy nhóm hoặc bạn không có quyền thực hiện thao tác này.";
const MSG_403 = "Bạn không có quyền thực hiện thao tác này.";

function parse(error: unknown): {
  status?: number;
  detail: string;
  errorCode: string;
} {
  const e = error as AxiosError<SprintApiErrorBody>;
  const data = e.response?.data;
  return {
    status: e.response?.status,
    detail: (typeof data?.detail === "string" ? data.detail : "").trim().toLowerCase(),
    errorCode: (typeof data?.errorCode === "string" ? data.errorCode : "").trim(),
  };
}

export function sprintApiToastMessage(
  error: unknown,
  context: SprintToastErrorContext,
  fallback: string,
): string {
  const { status, detail, errorCode } = parse(error);

  if (context === "deleteSprint") {
    if (detail.includes("only draft") && detail.includes("delet")) {
      return "Chỉ có thể xóa sprint ở trạng thái nháp (Draft).";
    }
    if (errorCode === "ts.validation.unprocessable") {
      return "Không thể xóa sprint. Chỉ sprint nháp (Draft) mới được xóa.";
    }
  }

  if (context === "activateSprint") {
    if (detail.includes("only draft") && (detail.includes("activ") || detail.includes("active"))) {
      return "Chỉ sprint nháp (Draft) mới có thể được kích hoạt.";
    }
    if (detail.includes("semantic errors") || detail.includes("well-formed")) {
      return "Không thể kích hoạt sprint. Chỉ sprint nháp (Draft) mới được kích hoạt.";
    }
    if (errorCode === "ts.validation.unprocessable") {
      return "Không thể kích hoạt sprint. Chỉ sprint nháp (Draft) mới được kích hoạt.";
    }
  }

  if (context === "completeSprint") {
    if (detail.includes("only active") && detail.includes("complet")) {
      return "Chỉ sprint đang hoạt động (Active) mới có thể hoàn thành.";
    }
    if (detail.includes("semantic errors") || detail.includes("well-formed")) {
      return "Không thể hoàn thành sprint. Chỉ sprint đang hoạt động (Active) mới được đánh dấu hoàn thành.";
    }
    if (errorCode === "ts.validation.unprocessable") {
      return "Không thể hoàn thành sprint. Chỉ sprint đang hoạt động (Active) mới được đánh dấu hoàn thành.";
    }
  }

  if (context === "cancelSprint") {
    if (detail.includes("only active") && (detail.includes("cancel") || detail.includes("cancell"))) {
      return "Chỉ sprint đang hoạt động (Active) mới có thể hủy.";
    }
    if (detail.includes("semantic errors") || detail.includes("well-formed")) {
      return "Không thể hủy sprint. Chỉ sprint đang hoạt động (Active) mới được hủy.";
    }
    if (errorCode === "ts.validation.unprocessable") {
      return "Không thể hủy sprint. Chỉ sprint đang hoạt động (Active) mới được hủy.";
    }
  }

  if (context === "createEditSprint") {
    if (detail.includes("date range overlaps") || (detail.includes("overlap") && detail.includes("date"))) {
      return "Khoảng thời gian sprint bị trùng với sprint khác.";
    }
    if (errorCode === "ts.validation.unprocessable") {
      return "Dữ liệu sprint không hợp lệ. Vui lòng kiểm tra lại ngày và thông tin.";
    }
  }

  if (context === "generateSprintAi") {
    if (errorCode === "ts.validation.unprocessable") {
      return "Yêu cầu tạo sprint bằng AI không hợp lệ. Vui lòng kiểm tra nội dung và thử lại.";
    }
  }

  if (status === 404) {
    return context === "generateSprintAi" ? MSG_404_GROUP_AI : MSG_404_SPRINT;
  }
  if (status === 403) {
    return MSG_403;
  }

  return fallback;
}
