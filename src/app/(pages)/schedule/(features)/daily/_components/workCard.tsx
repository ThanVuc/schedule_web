import { Card } from "@/components/ui";
import { WorkCategory, WorkLabel } from "../../../_components";
import { WorkCardModel } from "../_models/type";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { EyeIcon, PencilIcon, TrashIcon } from "@/components/icon";
import { DraftLabel, ModelType } from "../../../_constant/common";
import Time from "../../../_components/time";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/app/(pages)/(main)/profile/utils";

interface ScheduleCardProps {
  workCard: WorkCardModel;
}

const WorkCard = ({ workCard }: ScheduleCardProps) => {
  const labels = Array.isArray(workCard.labels) ? workCard.labels : [];
  const Draft = labels.find(label => label.key === DraftLabel.DRAFT);
  const searchParams = useSearchParams();
  const router = useRouter();
  const handlePageQueryToModal = (mode: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);
    if (id) {
      params.set("id", id)
    } else {
      params.delete("id");
    }

    router.push(`/schedule/daily?${params.toString()}`, { scroll: false });
  }
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className={`w-full sm:w-260 bg-white/2 rounded-2xl p-3 sm:p-1 border-l-4 ${Draft ? "border-[#E879F9]/70" : "border-[#00C8FF]/70"}`}>
          <div className="px-1 sm:px-3 py-2 flex flex-col gap-2 sm:gap-3">
            <div className="flex sm:flex-row justify-between sm:items-center mb-2 border-b-2 border-slate-600 gap-2 pb-2">
              <p className="text-[#98D9F1] font-semibold font-family-Poppins italic text-sm sm:text-xl text-center sm:text-left">
                {workCard.name}
              </p>
              <div className="flex justify-center sm:justify-end">
                <WorkCategory label={workCard.category.name} keyIcon={workCard.category.key} color={workCard.category.color} label_type={workCard.category.label_type} />
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap justify-start sm:gap-3 gap-2 text-xs sm:text-sm">
              {
                Draft && <WorkLabel label={Draft.name} keyIcon={Draft.key} color={Draft.color} label_type={Draft.label_type} />
              }
              <Time
                Begin={formatDate.numberToDate(workCard.start_date)?.toString()}
                End={formatDate.numberToDate(workCard.end_date)?.toString()}
                Icon="Work"
              />
              {workCard.labels.filter(label => label.key !== DraftLabel.DRAFT).map(label => {
                return <WorkLabel key={label.id} label={label.name} keyIcon={label.key} color={label.color} label_type={label.label_type} />;
              })}
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <p className="font-bold italic text-sm text-white">Mục tiêu:</p>
              <p className="text-[#AFEEBF] font-light italic text-sm">{workCard.goal}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <p className="font-bold italic text-sm text-white">Mô tả ngắn:</p>
              <p className="font-light italic text-sm text-slate-200">{workCard.short_descriptions}</p>
            </div>
          </div>
        </Card>
        <ContextMenuContent className="bg-[#1E1E1E] border-2 shadow-lg p-0">
          <ContextMenuItem className="border-b rounded-none" onClick={() => handlePageQueryToModal(ModelType.VIEW, workCard.id)}><EyeIcon className="!text-white" />Chi tiết công việc</ContextMenuItem>
          <ContextMenuItem className="border-b rounded-none" onClick={() => handlePageQueryToModal(ModelType.UPDATE, workCard.id)}><PencilIcon className="!text-[#E8DC73]" /> Chỉnh sửa</ContextMenuItem>
          <ContextMenuItem className="border-b rounded-none" onClick={() => handlePageQueryToModal(ModelType.DELETE, workCard.id)}><TrashIcon className="!text-[#FF4848]" /> Xóa</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuTrigger>
    </ContextMenu>
  );
};

export default WorkCard;
