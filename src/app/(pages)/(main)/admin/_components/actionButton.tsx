import { P } from "@/components/common";
import { Button } from "@/components/ui";
import { forwardRef } from "react";

export interface ActionButtonProps {
    className?: string;
    variant?: "outline" | "secondary" | "destructive";
    buttonText?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ className, variant = "outline", buttonText, icon, onClick }, ref) => {
        const defaultClass =
            variant === "destructive"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "hover:bg-gray-100"

        return (
            <Button
                ref={ref}
                onClick={onClick}
                className={`flex flex-row justify-center cursor-pointer ${defaultClass} hover:scale-105 ${className}`}
                variant={variant}
            >
                {icon && <span>{icon}</span>}
                <P>{buttonText}</P>
            </Button>
        )
    }
)

ActionButton.displayName = "ActionButton";
