import type { AxiosError } from "axios";
import type { MemberApiErrorBody, MemberToastErrorContext } from "./memberTypes";

export type { MemberToastErrorContext };

const MSG_404 =
  "Không tìm thấy nhóm/thành viên hoặc bạn không có quyền thực hiện thao tác này.";
const MSG_403 = "Bạn không có quyền thực hiện thao tác này.";

function parse(error: unknown): {
  status?: number;
  detail: string;
  errorCode: string;
} {
  const e = error as AxiosError<MemberApiErrorBody>;
  const data = e.response?.data;
  const rawDetail =
    (typeof data?.detail === "string" ? data.detail : "") ||
    (typeof data?.message === "string" ? data.message : "") ||
    (typeof data?.error === "string" ? data.error : "");
  return {
    status: e.response?.status,
    detail: rawDetail.trim().toLowerCase(),
    errorCode: (typeof data?.errorCode === "string" ? data.errorCode : "").trim(),
  };
}

export function memberApiToastMessage(
  error: unknown,
  context: MemberToastErrorContext,
  fallback: string,
): string {
  const { status, detail, errorCode } = parse(error);

  if (context === "inviteMember") {
    if (
      detail.includes("already") &&
      (detail.includes("member") || detail.includes("invite") || detail.includes("exist"))
    ) {
      return "Email này đã được mời hoặc đã là thành viên nhóm.";
    }
    if (detail.includes("invalid") && detail.includes("email")) {
      return "Địa chỉ email không hợp lệ.";
    }
    if (errorCode === "ts.validation.unprocessable") {
      return "Không thể gửi lời mời. Vui lòng kiểm tra email và vai trò.";
    }
  }

  if (context === "changeMemberRole") {
    if (detail.includes("owner") && (detail.includes("cannot") || detail.includes("not allowed"))) {
      return "Không thể thay đổi vai trò Owner theo cách này.";
    }
    if (errorCode === "ts.validation.unprocessable") {
      return "Không thể đổi vai trò. Kiểm tra quyền và vai trò hợp lệ.";
    }
  }

  if (context === "removeMember") {
    if (detail.includes("owner") || detail.includes("cannot remove")) {
      return "Không thể xóa thành viên này (ví dụ Owner hoặc chính bạn).";
    }
    if (errorCode === "ts.validation.unprocessable") {
      return "Không thể xóa thành viên. Kiểm tra quyền hoặc ràng buộc nhóm.";
    }
  }

  if (status === 404) {
    return MSG_404;
  }
  if (status === 403) {
    return MSG_403;
  }

  return fallback;
}
