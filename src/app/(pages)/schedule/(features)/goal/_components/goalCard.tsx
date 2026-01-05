import { Card } from "@/components/ui";
import { LabelCategory, LabelSelector } from "../../../_components";
import { GoalCardModel, GoalLabelModel } from "../_models/type/goalCard.type";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ContextMenuItem } from "@radix-ui/react-context-menu";
import { EyeIcon, PencilIcon, TrashIcon } from "@/components/icon";
import { useRouter, useSearchParams } from "next/navigation";
import Time from "../../../_components/time";
import { stringToDate } from "../utils";
import { ModelType } from "../../../_constant";
import { useAxiosMutation, useToastState } from "@/hooks";
import GoalApiUrl from "@/api/goal";

interface GoalCardProps {
  GoalCard: GoalCardModel;
  availableLabels?: GoalLabelModel[];
  onRefetch?: () => void;
}

interface SwapLabelBody {
  label_type: number;
  label_id: string;
}

const GoalCard = ({ GoalCard, availableLabels, onRefetch }: GoalCardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const labels: GoalLabelModel[] = GoalCard?.labels ?? [];
  const category: GoalLabelModel | null = GoalCard?.category ?? null;
  const begin = stringToDate(GoalCard?.start_date);
  const end = stringToDate(GoalCard?.end_date);


  const { setToast } = useToastState();
  const { sendRequest: swapLabelRequest } = useAxiosMutation<
    { is_success?: boolean; message?: string },
    SwapLabelBody
  >({
    method: "PATCH",
    url: `${GoalApiUrl.getListGoals}`,
    headers: { "Content-Type": "application/json" },
  });

  const pushModeWithId = (mode: string) => {
    const id = (GoalCard as any)?.id;
    if (!id) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);
    params.set("id", String(id));
    router.push(`/schedule/goal?${params.toString()}`, { scroll: false });
  };

  const statusLabel = labels.find((label) => label.label_type === 2);
  const statusColor = statusLabel?.color ?? "#00C8FF";

  const handleView = () => pushModeWithId(ModelType.VIEW);
  const handleEdit = () => pushModeWithId(ModelType.UPDATE);
  const handleDelete = () => pushModeWithId(ModelType.DELETE);

  const handleQuickSwap = async (labelType: number, labelId: string) => {
    const id = (GoalCard as any)?.id;


    const currentLabel = labels.find((label) => label.label_type === labelType);

    if (currentLabel && String(currentLabel.id) === String(labelId)) {
      return;
    }

    const body: SwapLabelBody = {
      label_type: labelType,
      label_id: String(labelId),
    };

    try {
      const url = `${id}`;

      const { data, error } = await swapLabelRequest(body, url);

      if (error) {
        setToast({
          title: "Lỗi hệ thống",
          message: "Không thể đổi nhãn mục tiêu",
          variant: "error",
          closeable: false,
        });
        return;
      }

      if (data?.is_success ?? false) {
        setToast({
          title: "Thành công",
          message: "Đã cập nhật nhãn mục tiêu",
          variant: "success",
          closeable: true,
        });

        if (onRefetch) {
          onRefetch();
        }
      } else {
        setToast({
          title: "Thất bại",
          message: data?.message ?? "Cập nhật nhãn mục tiêu không thành công",
          variant: "error",
          closeable: true,
        });
      }
    } catch {
      setToast({
        title: "Lỗi hệ thống",
        message: "Không thể đổi nhãn mục tiêu",
        variant: "error",
        closeable: false,
      });
    }
  };

  const handleSwapLabel = async (newLabel: GoalLabelModel) => {
    await handleQuickSwap(newLabel.label_type, String(newLabel.id));
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 bg-white/2 rounded-2xl p-3 sm:p-1 border-l-4"
          style={{ borderColor: statusColor + "B3" }}
        >
          <div className="px-1 sm:px-3 py-2 flex flex-col gap-2 sm:gap-3">
            <div className="flex sm:flex-row justify-between sm:items-center mb-2 border-b-2 border-slate-600 gap-2 pb-2">
              <p
                className=" font-semibold font-family-Poppins italic text-sm sm:text-xl text-center sm:text-left"
                style={{ color: statusColor + "CC" }}
              >
                {GoalCard?.name ?? "-"}
              </p>
              <div className="flex justify-center sm:justify-end">
                {category && (
                  <LabelCategory
                    key={category.id}
                    label={category.name}
                    keyIcon={category.key}
                    color={category.color}
                    label_type={category.label_type}
                    onchange={(labelId: string) => handleQuickSwap(category.label_type, labelId)}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap justify-start sm:gap-3 gap-2 text-xs sm:text-sm">
              <Time Begin={begin} End={end} Icon={"Goal"} />
              {labels.map((label) => (
                <LabelSelector
                  key={label.id}
                  label={label.name}
                  keyIcon={label.key}
                  color={label.color}
                  label_type={label.label_type}
                  onchange={(labelId: string) => handleQuickSwap(label.label_type, labelId)}
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
        <ContextMenuItem onClick={handleDelete} className="border-b rounded-sm flex gap-3 items-center p-2 px-4 cursor-pointer hover:bg-white/10">
          <TrashIcon className="!text-red-500" />Xóa
        </ContextMenuItem>

        {availableLabels && availableLabels.length > 0 && (
          <>
            <div className="border-t border-slate-700 text-xs text-slate-300 px-2 py-1">Đổi nhãn</div>
            {availableLabels.map((al) => {
              const isActive = labels.some(label =>
                label.label_type === al.label_type &&
                String(label.id) === String(al.id)
              );

              return (
                <ContextMenuItem
                  key={al.id}
                  onClick={() => handleSwapLabel(al)}
                  className={`rounded-sm flex gap-3 items-center p-2 px-4 cursor-pointer hover:bg-white/10 ${isActive ? 'bg-white/5' : ''}`}
                  disabled={isActive}
                >
                  <LabelSelector
                    label={al.name}
                    keyIcon={al.key}
                    color={al.color}
                    label_type={al.label_type}
                  />
                </ContextMenuItem>
              );
            })}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GoalCard;