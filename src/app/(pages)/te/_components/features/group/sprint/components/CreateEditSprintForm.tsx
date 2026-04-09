import { Input, Label } from "@/components/ui";
import type { SprintFormData } from "../sprintTypes";

const labelClassName = "text-xs font-medium text-[#C9D4E4]";
const controlClassName =
  "h-9 rounded-lg border border-[#1D2C43] bg-[#0F1A2F] px-4 text-sm text-white placeholder:text-[#60708A] focus-visible:ring-1 focus-visible:ring-[#2B79C2] focus-visible:border-[#2B79C2]";

export default function CreateEditSprintForm({
  data,
  setData,
}: {
  data: SprintFormData;
  setData: React.Dispatch<React.SetStateAction<SprintFormData>>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className={labelClassName}>Tên Sprint</Label>
        <Input
          type="text"
          placeholder="Nhập tên sprint"
          maxLength={200}
          className={controlClassName}
          value={data.name}
          onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="space-y-1.5">
        <Label className={labelClassName}>Mục tiêu Sprint</Label>
        <Input
          type="text"
          placeholder="Nhập mục tiêu sprint"
          maxLength={5000}
          className={controlClassName}
          value={data.goal}
          onChange={(e) => setData((prev) => ({ ...prev, goal: e.target.value }))}
        />
      </div>

      <div className="flex gap-3 justify-between">
        <div className="space-y-2">
          <Label className={labelClassName}>Ngày bắt đầu</Label>
          <Input
            type="date"
            className={controlClassName + " [color-scheme:dark]"}
            value={data.startDate}
            onChange={(e) => setData((prev) => ({ ...prev, startDate: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelClassName}>Ngày kết thúc</Label>
          <Input
            type="date"
            className={controlClassName + " [color-scheme:dark]"}
            value={data.endDate}
            onChange={(e) => setData((prev) => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
}

