import { Card } from "@/components/ui";
import { Category, Difficulty, PriorityLevel, Status, TaskType, Time } from "../labels/components";

interface ScheduleCardProps {
  title: string;
  category: "Work" | "Personal" | "Study" | "Family" | "Finance" | "Health" | "Social" | "Travel";
  time: {
    begin: string;
    end: string;
  };
  taskType: "Repeat" | "Group" | "Daily";
  status: "NotStarted" | "InProgress" | "Completed" | "Overdue" | "GiveUp";
  difficulty: "Easy" | "Medium" | "Hard";
  priorityLevel: "High" | "Medium" | "Low" | "Peaceful";
  goal: string;
  shortDescription: string;
}

const ScheduleCard = ({title,category,time, taskType,status,difficulty,priorityLevel,goal,shortDescription,}: ScheduleCardProps) => {
  return (
    <Card className="w-full sm:w-260 bg-white/2 rounded-2xl p-3 sm:p-1 border-l-4 border-[#00C8FF]/70">
      <div className="px-1 sm:px-3 py-2 flex flex-col gap-2 sm:gap-3">
        <div className="flex sm:flex-row justify-between sm:items-center mb-2 border-b-2 border-slate-600 gap-2 pb-2">
          <p className="text-[#98D9F1] font-semibold font-family-Poppins italic text-sm sm:text-xl text-center sm:text-left">
            {title}
          </p>
          <div className="flex justify-center sm:justify-end">
            <Category type={category} />
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap justify-start sm:gap-3 gap-2 text-[11px] sm:text-[13px]">
          <Time Begin={time.begin} End={time.end} />
          <TaskType type={taskType} />
          <Status type={status} />
          <Difficulty type={difficulty} />
          <PriorityLevel type={priorityLevel} />
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <p className="font-bold italic text-[12px] text-white">Mục tiêu:</p>
          <p className="text-[#AFEEBF] font-light italic text-[12px]">{goal}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <p className="font-bold italic text-[12px] text-white">Mô tả ngắn:</p>
          <p className="font-light italic text-[12px] text-slate-200">{shortDescription}</p>
        </div>
      </div>
    </Card>
  );
};

export default ScheduleCard;
