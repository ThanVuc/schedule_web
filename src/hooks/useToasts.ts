import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

type ToastProp = {

    title?: string;
    message: string;
    variant?: "default" | "destructive";

};

export default function useToastState() {
    const [toastState, setToastState] = useState<ToastProp | null>(null);

    useEffect(() => {
        if (toastState) {
            const {
                variant = "destructive",

                title = "Thông báo",
                message,
            } = toastState;

            // @ts-ignore
            toast(title, {
                description: message,
                action: {
                    label: "X",
                    onClick: () => { },
                }
            });
            setToastState(null);
        }
    }, [toastState]);
    const setToast = useCallback((options: ToastProp) => {
        setToastState(options);
    }, []);

    return { setToast };
}