"use client";
import { useLabelIcon } from "@/hooks/useLabelIcon";
interface LabelProps {
    label: string;
    icon: string;
    color: string;
    width?: number;
    height?: number;
}

const Label = ({ label, icon, color, width=4, height=4 }: LabelProps) => {
    const IconComponent = useLabelIcon(icon);
    return (
        <div className="flex w-full">
            <div
                className="flex w-full justify-center gap-1 p-1 text-sm rounded-md border-2 items-center"
                style={{
                    color: color,
                    backgroundColor: `${color}20`,
                    borderColor: color,
                }}
            >
                {IconComponent && <IconComponent className={`!w-${width} !h-${height} text-[${color}]`} />}
                {label}
            </div>
        </div>
    );
}

export default Label;