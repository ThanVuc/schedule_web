import z from "zod";
import { UpsertGoalSchema } from "../_models/schema";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { FormField, FormItem, FormMessage, Input, Textarea } from "@/components/ui";
import { DateTimePicker } from "@/components/common/dateTimePicker";
import { CalendarIcon } from "lucide-react";
import InfoPopover from "../../daily/_components/infoPopover";
import { WorkLabel } from "../../../_components";
import MiniTask from "../../../_components/miniTask/miniTask";
import { GoalLabelsGroup } from "../_models/type";

type GoalForm = z.infer<typeof UpsertGoalSchema>

interface UpsertGoalFormProps {
    form: UseFormReturn<GoalForm>
    isDisabled?: boolean
    defaultLabel: GoalLabelsGroup | null
}

const UpsertGoalForm = ({ form, isDisabled = false, defaultLabel }: UpsertGoalFormProps) => {
    const titleLabel = "border-2 span-2 rounded-md bg-white/10 md:w-27 lg:w-30 sm:w-25 h-9 flex items-center justify-center"

    return (
        <>
            <div className="flex justify-between gap-10">
                <div className="basis-2/3 w-full">
                    <Label className="text-lg mb-5 text-[#94FEF5] font-bold pb-4">Thông Tin Cơ Bản</Label>
                    <div className="pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mb-4">
                                    <Input
                                        disabled={isDisabled}
                                        {...field}
                                        className="rounded-sm"
                                        placeholder="Tên mục tiêu"
                                        id={field.name}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex w-full gap-4 pb-4">
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col mb-4">
                                        <DateTimePicker
                                            defaultValue={field.value}
                                            disabledDate={isDisabled}
                                            title="Từ"
                                            {...field}
                                            icon={<CalendarIcon />}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col mb-4">
                                        <DateTimePicker
                                            defaultValue={field.value}
                                            disabledDate={isDisabled}
                                            title="Đến"
                                            {...field}
                                            icon={<CalendarIcon />}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Label className="text-lg my-5 text-[#FFF583] font-bold">Nhãn Dán</Label>
                        <div className="ml-8 flex gap-5 border-b-2 pb-7 pt-6">
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex justify-between w-full">
                                    <div className="flex gap-6 items-center">
                                        <span className={titleLabel}>Trạng thái</span>
                                        <FormField
                                            control={form.control}
                                            name="status_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <WorkLabel
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
                                    <InfoPopover label="Status" />
                                </div>
                                <div className="flex justify-between w-full">
                                    <div className="flex gap-6 items-center">
                                        <span className={titleLabel}>Độ khó</span>
                                        <FormField
                                            control={form.control}
                                            name="difficulty_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <WorkLabel
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
                                    <InfoPopover label="Difficulty" />
                                </div>
                                <div className="flex justify-between w-full">
                                    <div className="flex gap-6 items-center">
                                        <span className={titleLabel}> Độ ưu tiên</span>
                                        <FormField
                                            control={form.control}
                                            name="priority_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <WorkLabel
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
                                    <InfoPopover label="Priority" />
                                </div>
                                <div className="flex justify-between w-full">
                                    <div className="flex gap-6 items-center">
                                        <span className={titleLabel}>Danh Mục</span>
                                        <FormField
                                            control={form.control}
                                            name="category_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <WorkLabel
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
                                    <InfoPopover label="Category" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <FormField
                                control={form.control}
                                name="tasks"
                                render={({ field }) => (
                                    <FormItem>
                                        <MiniTask {...field} disable={isDisabled} />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="basis-1/3">
                    <Label className="text-lg mb-5 text-[#97FB99] font-bold">Mô tả mục tiêu</Label>
                    <div className="ml-8 pb-7 pt-4">
                        <FormField
                            control={form.control}
                            name="short_descriptions"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mb-4">
                                    <Textarea
                                        disabled={isDisabled}
                                        className="border-dashed"
                                        {...field}
                                        placeholder="Mô tả ngắn"
                                        id={field.name}
                                        rows={5}
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
                                        className="border-dashed w-full h-32"
                                        {...field}
                                        placeholder="Mô tả chi tiết"
                                        id={field.name}
                                        rows={8}
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