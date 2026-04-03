// Thêm ở đầu file hoặc tạo file riêng: hooks/useDebouncedUpdate.ts
import { useCallback, useRef } from "react";

export const useDebouncedUpdate = <TPayload = unknown, TResponse = unknown>(
    sendRequest: (data: TPayload) => Promise<TResponse> | TResponse,
    delay: number = 2000,
    onResponse?: (response: TResponse) => void,
) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedUpdate = useCallback((data: TPayload) => {
        // Xóa timeout cũ nếu có
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Tạo timeout mới
        timeoutRef.current = setTimeout(async () => {
            const response = await sendRequest(data);
            onResponse?.(response);
        }, delay);
    }, [sendRequest, delay, onResponse]);

    // Cleanup khi component unmount
    const cleanup = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return { debouncedUpdate, cleanup };
};