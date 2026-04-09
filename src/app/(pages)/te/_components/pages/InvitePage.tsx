"use client";

import InviteApiUrl from "@/api/invite.api";
import { useCsrfToken } from "@/context/csrf.context";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";


type AcceptanceResponse = {
    location?: string;
};

type AcceptanceErrorResponse = {
    detail?: string;
    message?: string;
    error?: string;
};

const normalizeDestination = (value?: string | null): string | null => {
    if (!value) return null;
    const raw = value.trim();
    if (!raw) return null;

    try {
        const decoded = decodeURIComponent(raw);
        const parsed = new URL(decoded, typeof window !== "undefined" ? window.location.origin : "https://localhost:3000");
        if (parsed.pathname.startsWith("/te/group")) {
            return `${parsed.pathname}${parsed.search}${parsed.hash}`;
        }
        return null;
    } catch {
        return raw.startsWith("/te/group") ? raw : null;
    }
};

export const InvitePage = () => {
    const searchParams = useSearchParams();

    const code = searchParams.get("code");
    const redirectUrl = searchParams.get("url");
    const joinDestination = normalizeDestination(redirectUrl);

    const csrfToken = useCsrfToken();
    const hasAcceptedRef = useRef(false);

    const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [nextLocation, setNextLocation] = useState<string | null>(null);

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
            const destination = normalizeDestination(data?.location) ?? joinDestination;
            if (destination) {
                setNextLocation(destination);
                setSuccessMessage("Đã chấp nhận lời mời thành công. Bạn có thể tiếp tục đến trang nhóm.");
                setStatus("success");
                return;
            }

            setStatus("error");
            setErrorMessage("Lỗi không xác định: không nhận được đường dẫn nhóm hợp lệ từ máy chủ.");
        };

        accept();
    }, [csrfToken, code, joinDestination]);

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

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-center px-4">
                <p className="text-green-400 text-sm">{successMessage}</p>
                {nextLocation && (
                    <a
                        href={nextLocation}
                        className="text-xs text-blue-400 underline hover:text-blue-300 transition-colors"
                    >
                        Mở trang nhóm
                    </a>
                )}
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