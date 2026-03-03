"use client";
import { Button } from "@/components/ui";
import { useLabelIcon } from "@/hooks/useLabelIcon";
interface LabelProps {
    label: string;
    icon: string;
    color: string;
    widthIcon?: number;
    heightIcon?: number;
    textSize?: string
    className?: string;
}

const Label = ({ label, icon, color, widthIcon, heightIcon, textSize, className }: LabelProps) => {
    const IconComponent = useLabelIcon(icon);
    return (
        <Button className="border-0 p-0 bg-transparent [&>svg]:hidden disabled:opacity-100 disabled:cursor-not-allowed hover:bg-transparent" disabled>
            <div
                className={`flex justify-center gap-1 p-1 text-${textSize} rounded-md border-2 items-center ${className}`}
                style={{
                    color: color,
                    backgroundColor: `${color}20`,
                    borderColor: color,
                }}
            >
                {IconComponent && <IconComponent className={`!w-${widthIcon} !h-${heightIcon} text-[${color}]`} />}
                {label}
            </div>
        </Button>
    );
}

export default Label;
