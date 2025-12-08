import { Card } from "@/components/ui";
import { WorkCategory, WorkLabel } from "../../../_components";
import { GoalCardModel, GoalLabelModel, GoalLabelsGrouped } from "../_models/type/goalCard";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ContextMenuItem } from "@radix-ui/react-context-menu";
import { EyeIcon, PencilIcon, TrashIcon } from "@/components/icon";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/app/(pages)/(main)/profile/utils";
import Time from "../../../_components/time";

interface GoalCardProps {
  GoalCard: GoalCardModel;
  onDelete?: (goal: GoalCardModel) => void;
}

const flattenLabels = (goalLabels?: GoalLabelsGrouped): GoalLabelModel[] => {
  if (!goalLabels) return [];

  const allLabels: GoalLabelModel[] = [];

  Object.values(goalLabels).forEach((labelArray) => {
    if (Array.isArray(labelArray)) {
      allLabels.push(...labelArray);
    }
  });

  return allLabels;
};

const toDate = (v: any): string => {
  if (v == null || v === "") return "";

  const timestamp = Number(v);
  if (!Number.isFinite(timestamp)) {
    return formatDate.numberToString(v);
  }

  return formatDate.numberToString(timestamp);
};

const GoalCard = ({ GoalCard, onDelete }: GoalCardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = Array.isArray(GoalCard?.category) ? GoalCard.category[0] : (GoalCard?.category as any) ?? null;
  const labels = flattenLabels(GoalCard?.goalLabels);
  const begin = toDate(GoalCard?.start_date);
  const end = toDate(GoalCard?.end_date);

  const pushModeWithId = (mode: string) => {
    const id = (GoalCard as any)?.id;
    if (!id) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);
    params.set("id", String(id));
    router.push(`/schedule/goal?${params.toString()}`);
  };

  const handleView = () => pushModeWithId("view");
  const handleEdit = () => pushModeWithId("edit");
  const handleDelete = () => {
    if (onDelete) {
      onDelete(GoalCard);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 bg-white/2 rounded-2xl p-3 sm:p-1 border-l-4 border-[#00C8FF]/70">
          <div className="px-1 sm:px-3 py-2 flex flex-col gap-2 sm:gap-3">
            <div className="flex sm:flex-row justify-between sm:items-center mb-2 border-b-2 border-slate-600 gap-2 pb-2">
              <p className="text-[#98D9F1] font-semibold font-family-Poppins italic text-sm sm:text-xl text-center sm:text-left">
                {GoalCard?.name ?? "-"}
              </p>
              <div className="flex justify-center sm:justify-end">
                {category && (
                  <WorkCategory
                    key={category.id ?? ""}
                    label={category.name ?? ""}
                    icon={category.key ?? ""}
                    color={category.color ?? ""}
                    label_type={category.label_type ?? 0}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap justify-start sm:gap-3 gap-2 text-xs sm:text-sm">
              <Time Begin={begin} End={end} Icon={"Goal"} />
              {labels.map(label => (
                <WorkLabel
                  key={label.id}
                  label={label.name}
                  icon={label.key}
                  color={label.color}
                  label_type={label.label_type}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-2">
              <p className="font-bold italic text-sm text-white">Mô tả ngắn:</p>
              <p className="font-light italic text-sm text-slate-200">{GoalCard?.short_descriptions ?? "-"}</p>
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent className="bg-[#1E1E1E] border-2 shadow-lg p-0">
        <ContextMenuItem onClick={handleView} className="border-b rounded-sm flex gap-3 items-center p-2 px-4 cursor-pointer hover:bg-white/10">
          <EyeIcon className="!text-white" />Xem chi tiết
        </ContextMenuItem>
        <ContextMenuItem onClick={handleEdit} className="border-b rounded-sm flex gap-3 items-center p-2 px-4 cursor-pointer hover:bg-white/10">
          <PencilIcon className="!text-orange-500" />Chỉnh sửa
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} className="rounded-sm flex gap-3 items-center p-2 px-4 cursor-pointer hover:bg-white/10">
          <TrashIcon className="!text-red-500" />Xóa
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GoalCard;