import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

type ToastProp = {
    title?: string;
    message: string;
    variant?: "default" | "success" | "error" | "warning";
    closeable?: boolean;
};
export default function useToastState() {
    const [toastState, setToastState] = useState<ToastProp | null>(null);

    useEffect(() => {
        if (toastState) {
            const {
                title = "Thông báo",
                message,
                variant = "default",
                closeable = true,
            } = toastState;
            const toastOptions = {
                description: message,
                action: closeable
                    ? {
                        label: "X",
                        onClick: () => toast.dismiss(),
                    }
                    : undefined,
                duration: 3000,
            }

            switch (variant) {
                case "success":
                    toast.success(title, toastOptions);
                    break;
                case "error":
                    toast.error(title, toastOptions);
                    break;
                case "warning":
                    toast.warning(title, toastOptions);
                    break;
                default:
                    toast(title, toastOptions);
            }

            setToastState(null);
        }
    }, [toastState]);
    const setToast = useCallback((options: ToastProp) => {
        setToastState(options);
    }, []);

    return { setToast };
}