import { useLabelIcon } from "@/hooks/useLabelIcon";

interface LabelProps {
    label: string;
    icon: string;
    color: string;
}

const WorkLabel = ({ label, icon, color }: LabelProps) => {
    const IconComponent = useLabelIcon(icon);
    return (
        <div
            className="flex justify-center gap-2 p-1 text-sm rounded-md border-2"
            style={{
                color: color,
                backgroundColor: `${color}20`,
                borderColor: color,
            }}
        >
            {IconComponent && <IconComponent />}
            {label}
        </div>
    );
}

export default WorkLabel;