import { Calendar } from "lucide-react";

interface TimeProps {
    Begin: string;
    End: string;
}

const GoalTime = ({ Begin, End }: TimeProps) => {
    return (
        <div className="text-xs bg-white/10 p-1.5 rounded-xl flex items-center"><Calendar className="!w-4 !h-4 mr-1" /> {Begin} - {End}</div>
    );
}

export default GoalTime;
