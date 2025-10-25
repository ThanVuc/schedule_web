"use client";
import { useLabelIcon } from "@/hooks/useLabelIcon";
interface LabelProps {
    label: string;
    icon: string;
    color: string;
    widthIcon?: number;
    heightIcon?: number;
    textSize?: string
}

const Label = ({ label, icon, color, widthIcon, heightIcon, textSize }: LabelProps) => {
    const IconComponent = useLabelIcon(icon);
    return (
        <div className="flex w-full">
            <div
                className={`flex justify-center gap-1 p-1 text-${textSize} rounded-md border-2 items-center`}
                style={{
                    color: color,
                    backgroundColor: `${color}20`,
                    borderColor: color,
                }}
            >
                {IconComponent && <IconComponent className={`w-${widthIcon} !h-${heightIcon} text-[${color}]`} />}
                {label}
            </div>
        </div>
    );
}

export default Label;