import { Calendar, ClockIcon } from "lucide-react";

interface TimeProps {
    Begin?: Date | string;
    End?: Date | string;
    Icon?: "Work" | "Goal";
}

const formatDateText = (value: Date | string) => {
    const date = typeof value === "string" ? new Date(value) : value;
    return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
    });
};

const Time = ({ Begin, End, Icon }: TimeProps) => {
    return (
        <div className="text-xs bg-white/10 p-1.5 rounded-xl flex items-center">
            {Icon === "Work" ? (
                <ClockIcon className="!w-4 !h-4 mr-1" />
            ) : (
                <Calendar className="!w-4 !h-4 mr-1" />
            )}

            {formatDateText(Begin ?? "")} - {formatDateText(End ?? "")}
        </div>
    );
};

export default Time;
