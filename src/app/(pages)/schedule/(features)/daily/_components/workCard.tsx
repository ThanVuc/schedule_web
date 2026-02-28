import { Card } from "@/components/ui";
import { LabelCategory, LabelSelector } from "../../../_components";
import { WorkCardModel } from "../_models/type";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { EyeIcon, PencilIcon, TrashIcon } from "@/components/icon";
import { DraftLabel, ModelType, OverdueLabel } from "../../../_constant/common";
import Time from "../../../_components/time";
import { useRouter, useSearchParams } from "next/navigation";
import { useAxiosMutation, useToastState } from "@/hooks";
import { QuickSwapLabelRequest } from "../_models/type/mutation.type";
import quickSwapLabelApiUrl from "@/api/quickSwapLabel";
import Label from "../../../_components/label";
import { useRefetch } from "./refetchContext";

interface ScheduleCardProps {
  workCard: WorkCardModel;
}

const WorkCard = ({ workCard }: ScheduleCardProps) => {
  const { setToast } = useToastState();
  const refetch = useRefetch();
  const labels = Array.isArray(workCard.labels) ? workCard.labels : [];
  const Draft = workCard.draft?.key === DraftLabel.DRAFT ? workCard.draft : undefined;
  const Overdue = workCard.overdue?.key === OverdueLabel.OVERDUE ? workCard.overdue : undefined;
  const BorderColor = labels.find(label => label.color);
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
  const { sendRequest } = useAxiosMutation<QuickSwapLabelRequest>({
    method: "PATCH",
    url: `${quickSwapLabelApiUrl.quickSwapLabel}/${workCard.id}`,
    headers: {
      "Content-Type": "application/json"
    }
  });
  const handleQuickSwap = async (label_type: number, label_id: string) => {
    const { error } = await sendRequest({ label_type, label_id });
    if (error) {
      setToast({
        title: "Lỗi hệ thống",
        message: "Không thể chuyển đổi nhãn nhanh",
        variant: "error",
      });
    } else {
      if (refetch) refetch();
    }
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          style={{
            "--border-color": BorderColor?.color,
          } as React.CSSProperties}
          className={`border-l-4 border-[color:var(--border-color)] pt-0 pb-2`}
        >
          <div className="px-1 sm:px-3 py-2 flex flex-col gap-1 sm:gap-3">
            <div className="flex sm:flex-row justify-between sm:items-center  border-b-2 border-slate-600 gap-2 pb-2">
              <p
                style={{ "--text-color": BorderColor?.color } as React.CSSProperties}
                className="text-[color:var(--text-color)] font-semibold font-family-Poppins text-sm sm:text-xl line-clamp-2 sm:line-clamp-1 break-all"
              >
                {workCard.name}
              </p>
              <div className="flex justify-center sm:justify-end flex-shrink-0">
                <LabelCategory label={workCard.category.name} onchange={(LabelId) => handleQuickSwap(workCard.category.label_type, LabelId)} keyIcon={workCard.category.key} color={workCard.category.color} label_type={workCard.category.label_type} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex flex-wrap sm:flex-nowrap justify-start items-center sm:gap-3 gap-2 text-xs sm:text-sm">
                {
                  Draft && <LabelSelector label={Draft.name} keyIcon={Draft.key} color={Draft.color} label_type={Draft.label_type} />
                }
                <Time
                  Begin={workCard.start_date}
                  End={workCard.end_date}
                  Icon="Work"
                />
                <div><Label label={workCard.work_type.name} heightIcon={4} textSize="sm" widthIcon={4} icon={workCard.work_type.key} color={workCard.work_type.color} /></div>
                {workCard.labels.filter(label => label.key !== DraftLabel.DRAFT).sort((a, b) => a.label_type - b.label_type).map(label => {
                  return <LabelSelector onchange={(LabelId) => handleQuickSwap(label.label_type, LabelId)} key={label.id} label={label.name} keyIcon={label.key} color={label.color} label_type={label.label_type} />;
                })}
              </div>
              <div>
                {
                  Overdue && <Label label={Overdue.name} heightIcon={4} textSize="sm" widthIcon={4} icon={Overdue.key} color={Overdue.color} />
                }
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <p className="font-bold italic text-sm text-white">Mục tiêu:</p>
              <p className="text-[#AFEEBF] font-light italic text-sm line-clamp-2 ">{workCard.goal}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2 ">
              <p className="font-bold italic text-sm text-white w-25">Mô tả ngắn:</p>
              <p className="font-light italic text-sm text-slate-200 break-words line-clamp-2 overflow-hidden">{workCard.short_descriptions}</p>
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
