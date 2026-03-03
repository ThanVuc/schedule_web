import { Calendar, ClockIcon } from "lucide-react";

interface TimeProps {
  Begin?: number ; 
  End?: number;  
  Icon?: "Work" | "Goal";
}

const formatDateText = (value?: number, type?: "Work" | "Goal") => {
  if (!value) return "";
  const date = new Date(value);

  if (type === "Work") {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (type === "Goal") {
    return date.toLocaleDateString("vi-VN");
  }

  return "";
};

const Time = ({ Begin, End, Icon }: TimeProps) => {
  return (
    <div className="text-xs bg-white/10 p-1.5 rounded-xl flex items-center w-max text-slate-200">
      {Icon === "Work" ? (
        <ClockIcon className="!w-4 !h-4 mr-1" />
      ) : (
        <Calendar className="!w-4 !h-4 mr-1" />
      )}

      {formatDateText(Begin, Icon)} - {formatDateText(End, Icon)}
    </div>
  );
};

export default Time;
