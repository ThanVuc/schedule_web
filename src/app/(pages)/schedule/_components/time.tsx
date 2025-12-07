import { Calendar } from "@/components/ui/calendar";
import { ClockIcon } from "lucide-react";

interface TimeProps {
    Begin: string;
    End: string;
    Icon: "Work" | "Goal";
}

const Time = ({ Begin, End, Icon }: TimeProps) => {
    return (
        <div className="text-xs bg-white/10 p-1.5 rounded-xl flex items-center"> { Icon === "Work" ? <ClockIcon className="!w-4 !h-4 mr-1" /> : <Calendar className="!w-4 !h-4 mr-1" />} {Begin} - {End}</div>
    );
}

export default Time;
