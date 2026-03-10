import z from "zod";
import { UpsertGoalSchema } from "../_models/schema";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { FormField, FormItem, FormMessage, Input, Textarea } from "@/components/ui";
import { DateTimePicker } from "@/components/common/dateTimePicker";
import { CalendarIcon } from "lucide-react";
import InfoPopover from "../../daily/_components/info/infoPopover";
import MiniTask from "../../../_components/miniTask/miniTask";
import { GoalLabelsGroup } from "../_models/type";
import { LabelSelector } from "../../../_components";

type GoalForm = z.infer<typeof UpsertGoalSchema>

interface UpsertGoalFormProps {
    form: UseFormReturn<GoalForm>
    isDisabled?: boolean
    defaultLabel: GoalLabelsGroup | null
}

const UpsertGoalForm = ({ form, isDisabled = false, defaultLabel }: UpsertGoalFormProps) => {
    const titleLabel = "border-2 rounded-md bg-white/10 w-28 h-9 flex items-center justify-center text-sm";

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 w-full">
                    <Label className="text-lg mb-4 text-[#94FEF5] font-bold block">Thông Tin Cơ Bản</Label>

                    <div className="pt-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mb-4">
                                    <Input
                                        disabled={isDisabled}
                                        {...field}
                                        className="rounded-sm disabled:opacity-90"
                                        placeholder="Tên mục tiêu"
                                        id={field.name}
                                        maxLength={126}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col md:flex-row w-full gap-4 pb-4">
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem className="flex-1 flex flex-col mb-0">
                                        <DateTimePicker
                                            defaultValue={field.value}
                                            disabledDate={isDisabled}
                                            title="Từ"
                                            {...field}
                                            icon={<CalendarIcon />}
                                            disabledTime
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem className="flex-1 flex flex-col mb-0">
                                        <DateTimePicker
                                            defaultValue={field.value}
                                            disabledDate={isDisabled}
                                            title="Đến"
                                            {...field}
                                            icon={<CalendarIcon />}
                                            disabledTime
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Label className="text-lg my-4 text-[#FFF583] font-bold block">Nhãn Dán</Label>

                        <div className="ml-0 md:ml-8 flex flex-col gap-5 border-b-2 pb-6 pt-4">
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex sm:flex-row sm:items-center justify-between w-full gap-3">
                                    <div className="flex items-center gap-4">
                                        <span className={titleLabel}>Trạng thái</span>
                                        <FormField
                                            control={form.control}
                                            name="status_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <LabelSelector
                                                        onchange={(id: string) => {
                                                            field.onChange(id);
                                                        }}
                                                        color={defaultLabel?.status?.color ?? ""}
                                                        keyIcon={defaultLabel?.status?.key ?? ""}
                                                        label={defaultLabel?.status?.name ?? ""}
                                                        label_type={defaultLabel?.status?.label_type ?? 0}
                                                        key={defaultLabel?.status?.id ?? ""}
                                                        classNameContentLabel="z-200"
                                                        disable={isDisabled}
                                                    />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-shrink-0">
                                        <InfoPopover label="Status" />
                                    </div>
                                </div>

                                <div className="flex sm:flex-row sm:items-center justify-between w-full gap-3">
                                    <div className="flex items-center gap-4">
                                        <span className={titleLabel}>Độ khó</span>
                                        <FormField
                                            control={form.control}
                                            name="difficulty_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <LabelSelector
                                                        onchange={(id: string) => {
                                                            field.onChange(id)
                                                        }}
                                                        color={defaultLabel?.difficulty?.color ?? ""}
                                                        keyIcon={defaultLabel?.difficulty?.key ?? ""}
                                                        label={defaultLabel?.difficulty?.name ?? ""}
                                                        label_type={defaultLabel?.difficulty?.label_type ?? 0}
                                                        key={defaultLabel?.difficulty?.id ?? ""}
                                                        classNameContentLabel="z-200"
                                                        disable={isDisabled}
                                                    />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-shrink-0">
                                        <InfoPopover label="Difficulty" />
                                    </div>
                                </div>

                                <div className="flex sm:flex-row sm:items-center justify-between w-full gap-3">
                                    <div className="flex items-center gap-4">
                                        <span className={titleLabel}>Độ ưu tiên</span>
                                        <FormField
                                            control={form.control}
                                            name="priority_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <LabelSelector
                                                        onchange={(id: string) => {
                                                            field.onChange(id);
                                                        }}
                                                        color={defaultLabel?.priority?.color ?? ""}
                                                        keyIcon={defaultLabel?.priority?.key ?? ""}
                                                        label={defaultLabel?.priority?.name ?? ""}
                                                        label_type={defaultLabel?.priority?.label_type ?? 0}
                                                        key={defaultLabel?.priority?.id ?? ""}
                                                        classNameContentLabel="z-200"
                                                        disable={isDisabled}
                                                    />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-shrink-0">
                                        <InfoPopover label="Priority" />
                                    </div>
                                </div>

                                <div className="flex sm:flex-row sm:items-center justify-between w-full gap-3">
                                    <div className="flex items-center gap-4">
                                        <span className={titleLabel}>Danh mục</span>
                                        <FormField
                                            control={form.control}
                                            name="category_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <LabelSelector
                                                        onchange={(id: string) => {
                                                            field.onChange(id);
                                                        }}
                                                        color={defaultLabel?.category?.color ?? ""}
                                                        keyIcon={defaultLabel?.category?.key ?? ""}
                                                        label={defaultLabel?.category?.name ?? ""}
                                                        label_type={defaultLabel?.category?.label_type ?? 0}
                                                        key={defaultLabel?.category?.id ?? ""}
                                                        classNameContentLabel="z-200"
                                                        disable={isDisabled}
                                                    />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-shrink-0">
                                        <InfoPopover label="Category" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3">
                            <FormField
                                control={form.control}
                                name="tasks"
                                render={({ field }) => (
                                    <FormItem>
                                        <MiniTask {...field} disable={isDisabled} type="Goal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <Label className="text-lg mb-4 text-[#97FB99] font-bold block">Mô tả mục tiêu</Label>
                    <div className="ml-0 md:ml-6 pb-4 pt-2">
                        <FormField
                            control={form.control}
                            name="short_descriptions"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mb-4">
                                    <Textarea
                                        disabled={isDisabled}
                                        className="border-dashed disabled:opacity-90 resize-y w-full h-30"
                                        {...field}
                                        placeholder="Mô tả ngắn"
                                        id={field.name}
                                        rows={4}
                                        maxLength={256}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="detailed_description"
                            render={({ field }) => (
                                <FormItem>
                                    <Textarea
                                        disabled={isDisabled}
                                        className="border-dashed w-full h-40 disabled:opacity-90 resize-y"
                                        {...field}
                                        placeholder="Mô tả chi tiết"
                                        id={field.name}
                                        rows={6}
                                        maxLength={512}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpsertGoalForm;