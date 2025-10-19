import { useLabelIcon } from "@/hooks/useLabelIcon";

interface LabelProps {
    label: string;
    icon: string;
    color: string;
      width?: string;
  height?: string;
}

const WorkLabel = ({ label, icon, color, width, height }: LabelProps) => {
    const IconComponent = useLabelIcon(icon);
    return (
        <div
            className="flex justify-center gap-2 p-1.5 text-sm rounded-md border-2"
            style={{
                color: color,
                backgroundColor: `${color}20`,
                borderColor: color,
            }}
        >
            {IconComponent && <IconComponent className={`!w-${width} !h-${height}`} />}
            {label}
        </div>
    );
}

export default WorkLabel;