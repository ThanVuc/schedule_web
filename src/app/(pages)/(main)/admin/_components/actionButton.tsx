import { P } from "@/components/common";
import { Button } from "@/components/ui";

export interface ActionButtonProps {
    className?: string;
    variant?: "outline" | "secondary" | "destructive";
    buttonText?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export const ActionButton = ({ className, variant = "outline", buttonText, icon, onClick }: ActionButtonProps) => {
    const defaultClass = variant === "destructive" ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-gray-100";
    return (
        
        <Button onClick={onClick} className={`flex flex-row justify-center cursor-pointer ${defaultClass} hover:scale-105 ${className}`} key="view" variant={variant}>
            {icon && <span className="">{icon}</span>}
            <P>{buttonText}</P>
        </Button>
    );
}