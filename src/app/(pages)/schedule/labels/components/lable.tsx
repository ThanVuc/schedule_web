
interface LabelProps {
    label: string;
    icon: string;
    color: string;
}

const Label = ({ label, icon, color }: LabelProps) => {
    return (
        <div
            className="flex justify-center gap-2 p-1 text-sm rounded-md border-2"
            style={{
                color: color,
                backgroundColor: `${color}20`,
                borderColor: color,
            }}
        >
            {icon}
            {label}
        </div>
    );
}

export default Label;