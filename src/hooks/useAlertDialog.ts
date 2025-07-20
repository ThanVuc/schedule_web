import { useState } from "react";

type AlertDialogProps = {
    title: string;
    description?: string;
    onSubmit?: () => void;
    submitText?: string;
    cancelText?: string;
    className?: string;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    onClose?: () => void;
};

export const useAlertDialog = () => {
    const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({
        open: false,
        title: "",
        description: "",
        submitText: "Continue",
        cancelText: "Cancel",
        className: "",
        onSubmit: undefined,
        onClose: undefined,
    });

    return {
        alertDialogProps,
        setAlertDialogProps,
    };
}