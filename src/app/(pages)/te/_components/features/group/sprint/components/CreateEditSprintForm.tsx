import { FormField, FormMessage, Input, Label } from "@/components/ui";
import type { UseFormReturn } from "react-hook-form";
import type { SprintFormData } from "../sprintTypes";

const labelClassName = "text-xs font-medium text-[#C9D4E4]";
const controlClassName =
  "h-9 rounded-lg border border-[#1D2C43] bg-[#0F1A2F] px-3 text-sm text-white placeholder:text-[#60708A] focus-visible:ring-1 focus-visible:ring-[#2B79C2] focus-visible:border-[#2B79C2]";

export default function CreateEditSprintForm({
  form,
}: {
  form: UseFormReturn<SprintFormData>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className={labelClassName}>Tên Sprint</Label>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                type="text"
                placeholder="Nhập tên sprint"
                maxLength={200}
                className={controlClassName}
              />
              <FormMessage className="text-xs" />
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="space-y-1.5">
          <Label className={labelClassName}>Ngày bắt đầu</Label>
          <FormField
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1">
                <Input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  placeholder="dd/mm/yyyy"
                  className={controlClassName + " [color-scheme:dark]"}
                />
                <FormMessage className="text-xs" />
              </div>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className={labelClassName}>Ngày kết thúc</Label>
          <FormField
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1">
                <Input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  placeholder="dd/mm/yyyy"
                  className={controlClassName + " [color-scheme:dark]"}
                />
                <FormMessage className="text-xs" />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

