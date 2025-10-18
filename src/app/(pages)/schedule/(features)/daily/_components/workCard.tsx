import { Card } from "@/components/ui";
import { WorkCategory, WorkLabel, WorkTime } from "../../../_components";
import { WorkCardModel } from "../_models/type";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { EyeIcon, PencilIcon, TrashIcon } from "@/components/icon";
import { DraftLabel } from "../../../_constant/common";

interface ScheduleCardProps {
  workCard: WorkCardModel;
}

const WorkCard = ({ workCard }: ScheduleCardProps) => {
  const Draft = workCard.labels.find(label => label.KEY === DraftLabel.DRAFT);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className={`w-full sm:w-260 bg-white/2 rounded-2xl p-3 sm:p-1 border-l-4 ${Draft ? "border-[#E879F9]/70" : "border-[#00C8FF]/70"}`}>
          <div className="px-1 sm:px-3 py-2 flex flex-col gap-2 sm:gap-3">
            <div className="flex sm:flex-row justify-between sm:items-center mb-2 border-b-2 border-slate-600 gap-2 pb-2">
              <p className="text-[#98D9F1] font-semibold font-family-Poppins italic text-sm sm:text-xl text-center sm:text-left">
                {workCard.title}
              </p>
              <div className="flex justify-center sm:justify-end">
                <WorkCategory label={workCard.category.name} icon={workCard.category.icon} color={workCard.category.color} />
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap justify-start sm:gap-3 gap-2 text-xs sm:text-sm">
              {
                Draft && <WorkLabel label={Draft.name} icon={Draft.icon} color={Draft.color} />
              }
              <WorkTime Begin={workCard.start_time} End={workCard.end_time} />
              {workCard.labels.filter(label => label.KEY !== DraftLabel.DRAFT).map(label => {
                return <WorkLabel key={label.id} label={label.name} icon={label.icon} color={label.color} />;
              })}
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <p className="font-bold italic text-sm text-white">Mục tiêu:</p>
              <p className="text-[#AFEEBF] font-light italic text-sm">{workCard.goal}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <p className="font-bold italic text-sm text-white">Mô tả ngắn:</p>
              <p className="font-light italic text-sm text-slate-200">{workCard.shortDescription}</p>
            </div>
          </div>
        </Card>
        <ContextMenuContent className="bg-[#1E1E1E] border-2 shadow-lg p-0">
          <ContextMenuItem className="border-b rounded-none"><EyeIcon className="!text-white" />Chi tiết công việc</ContextMenuItem>
          <ContextMenuItem className="border-b rounded-none"><PencilIcon className="!text-[#E8DC73]" /> Chỉnh sửa</ContextMenuItem>
          <ContextMenuItem className="border-b rounded-none"><TrashIcon className="!text-[#FF4848]" /> Xóa</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuTrigger>
    </ContextMenu>
  );
};

export default WorkCard;
