
interface LabelProps {
    label: string;
    icon: string;
    color: string;
}

const Label = ({ label, icon, color }: LabelProps) => {
    return (
        <div className={`flex justify-center gap-2 p-1 text-sm rounded-md border-2 text-[${color}] bg-[${color}]/20 border-[${color}]`}>
            {icon}
            {label}
        </div>
    );
}

export default Label;