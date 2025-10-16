import { useLabelIcon } from "@/hooks";

interface LabelProps {
  label: string;
  icon: string;
  color: string;
}

export const Category = ({ label, icon, color }: LabelProps) => {
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
      {IconComponent && <IconComponent />}
      {label}
    </div>
  );
};
