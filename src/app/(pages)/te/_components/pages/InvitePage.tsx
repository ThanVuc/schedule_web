"use client";

import InviteApiUrl from "@/api/invite.api";
import { useCsrfToken } from "@/context/csrf.context";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";


type AcceptanceResponse = {
    redirect_url?: string;
};

type AcceptanceErrorResponse = {
    redirect_url?: string;
    detail?: string;
    message?: string;
    error?: string;
};

const normalizeRedirectTarget = (value?: string | null): string | null => {
    if (!value) return null;
    const raw = value.trim();
    if (!raw) return null;

    try {
        const parsed = new URL(raw, typeof window !== "undefined" ? window.location.origin : "https://localhost:3000");
        if (typeof window !== "undefined" && parsed.origin === window.location.origin) {
            return `${parsed.pathname}${parsed.search}${parsed.hash}`;
        }
        if (parsed.protocol === "https:" || parsed.protocol === "http:") {
            return parsed.toString();
        }
        return null;
    } catch {
        return null;
    }
};

export const InvitePage = () => {
    const searchParams = useSearchParams();

    const code = searchParams.get("code");

    const csrfToken = useCsrfToken();
    const hasAcceptedRef = useRef(false);

    const [status, setStatus] = useState<"loading" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (!csrfToken) return;
        if (hasAcceptedRef.current) return;

        if (!code) {
            setStatus("error");
            setErrorMessage("Liên kết mời không hợp lệ — thiếu mã code.");
            return;
        }

        hasAcceptedRef.current = true;

        const accept = async () => {
            const normalizedCode = code.trim();
            const payload = {
                code: normalizedCode,
            };
            let data: AcceptanceResponse | null = null;
            let error: AxiosError | null = null;

            try {
                const response = await axios({
                    method: "POST",
                    url: InviteApiUrl.acceptance,
                    data: payload,
                    withCredentials: true,
                    headers: { "X-CSRF-Token": csrfToken },
                });
                data = (
                    response.data?.metadata ??
                    response.data ??
                    null
                ) as AcceptanceResponse | null;
            } catch (err) {
                error = err as AxiosError;
            }

            if (error) {
                const httpStatus = error?.response?.status;
                const errorBody = error?.response?.data as AcceptanceErrorResponse | undefined;
                const backendMessage =
                    errorBody?.detail ||
                    errorBody?.message ||
                    errorBody?.error ||
                    "";

                if (httpStatus === 301 || httpStatus === 302 || httpStatus === 401) {
                    const redirectTarget = normalizeRedirectTarget(errorBody?.redirect_url);
                    if (redirectTarget && typeof window !== "undefined") {
                        window.location.href = redirectTarget;
                        return;
                    }
                    setErrorMessage(backendMessage || "Yêu cầu đăng nhập. Vui lòng đăng nhập để chấp nhận lời mời.");
                    setStatus("error");
                    return;
                } else if (httpStatus === 404) {
                    setErrorMessage(backendMessage || "Liên kết mời không tồn tại hoặc đã hết hạn.");
                } else if (httpStatus === 400) {
                    setErrorMessage(
                        backendMessage || "Dữ liệu liên kết mời chưa hợp lệ (code). Vui lòng tạo link mới.",
                    );
                } else if (httpStatus === 409) {
                    setErrorMessage(backendMessage || "Bạn đã ở trong nhóm.");
                    setStatus("error");
                    return;
                } else if (httpStatus === 422) {
                    setErrorMessage(backendMessage || "Nhóm đã đầy hoặc liên kết mời không còn hiệu lực.");
                } else {
                    setErrorMessage(backendMessage || "Có lỗi xảy ra, vui lòng thử lại sau.");
                }

                setStatus("error");
                return;
            }
            const destination = normalizeRedirectTarget(data?.redirect_url);
            if (destination) {
                if (typeof window !== "undefined") {
                    window.location.href = destination;
                }
                return;
            }

            setStatus("error");
            setErrorMessage("Lỗi không xác định: không nhận được redirect_url hợp lệ từ máy chủ.");
        };

        accept();
    }, [csrfToken, code]);

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
                <p className="text-red-400 text-sm">{errorMessage}</p>
                <button
                    onClick={() => {
                        if (typeof window !== "undefined") {
                            window.location.href = "/";
                        }
                    }}
                    className="text-xs text-gray-400 underline hover:text-white transition-colors"
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-sm text-gray-400">
                Đang xử lý lời mời...
            </p>
        </div>
    );
};