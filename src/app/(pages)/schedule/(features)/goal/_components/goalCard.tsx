import { Card } from "@/components/ui";
import { WorkCategory, WorkLabel, WorkTime } from "../../../_components";
import { GoalCardModel } from "../_models/type/goalCard";

interface GoalCardProps {
  GoalCard: GoalCardModel;
}

const GoalCard = ({ GoalCard }: GoalCardProps) => {
  return (
    <Card className="w-full sm:w-290 bg-white/2 rounded-2xl p-3 sm:p-1 border-l-4 border-[#00C8FF]/70">
      <div className="px-1 sm:px-3 py-2 flex flex-col gap-2 sm:gap-3">
        <div className="flex sm:flex-row justify-between sm:items-center mb-2 border-b-2 border-slate-600 gap-2 pb-2">
          <p className="text-[#98D9F1] font-semibold font-family-Poppins italic text-sm sm:text-xl text-center sm:text-left">
            {GoalCard.title}
          </p>
          <div className="flex justify-center sm:justify-end">
            <WorkCategory label={GoalCard.category.name} icon={GoalCard.category.icon} color={GoalCard.category.color} label_type={GoalCard.category.label_type} />
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap justify-start sm:gap-3 gap-2 text-xs sm:text-sm">
          <WorkTime Begin={GoalCard.start_time} End={GoalCard.end_time} />
          {GoalCard.labels.map(label => {
            return <WorkLabel key={label.id} label={label.name} icon={label.icon} color={label.color} label_type={label.label_type} />;
          })}
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <p className="font-bold italic text-sm text-white">Mô tả ngắn:</p>
          <p className="font-light italic text-sm text-slate-200">{GoalCard.shortDescription}</p>
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;
