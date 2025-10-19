import { useLabelIcon } from "@/hooks";

interface LabelProps {
  label: string;
  icon: string;
  color: string;
  width?: string;
  height?: string;
}

export const WorkCategory = ({ label, icon, color, width, height }: LabelProps) => {
  const IconComponent = useLabelIcon(icon);
  return (
    <div
      className="flex items-center justify-center gap-2 p-1 text-sm rounded-md border-2"
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
};
