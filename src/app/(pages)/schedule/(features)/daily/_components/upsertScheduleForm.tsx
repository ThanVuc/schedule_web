import z from "zod";
import { upsertScheduleSchema } from "../_models/schema";
import { UseFormReturn } from "react-hook-form";
import { Checkbox, FormField, FormItem, FormMessage, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from "@/components/ui";
import { DateTimePicker } from "@/components/common/dateTimePicker";
import { CalendarIcon } from "@/components/icon";
import InfoPopover from "./infoPopover";
import MiniTask from "../../../_components/miniTask/miniTask";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { labelDefault } from "../_models/type/label";
import { useState } from "react";
import { LabelSelector } from "../../../_components";

type ScheduleForm = z.infer<typeof upsertScheduleSchema>
interface UpsertScheduleFormProps {
    form: UseFormReturn<ScheduleForm>
    labelDefaultData?: labelDefault
    disabled?: boolean
}
const UpsertScheduleForm = ({ form, labelDefaultData, disabled }: UpsertScheduleFormProps) => {
    const titleLabel = "border-2 p-2 rounded-md bg-white/10 md:min-w-35 max-w-21"
    const [currentTypeLabel, setCurrentTypeLabel] = useState(false);
    return (<>
        <div className="flex justify-between gap-10">
            <div className="basis-2/3 w-full">
                <Label className="text-lg mb-5 text-[#94FEF5] font-bold">Thông Tin Cơ Bản</Label>
                <div className="ml-8 ">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mb-4">
                                <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    className="rounded-sm disabled:opacity-100 disabled:cursor-not-allowed"
                                    placeholder="Tên công việc"
                                    id={field.name}
                                    disabled={disabled}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex w-full gap-4">
                        <FormField
                            control={form.control}
                            name="start_date"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col mb-4">
                                    <DateTimePicker defaultValue={field.value} disabled={disabled} disabledDate={!currentTypeLabel} title="Từ" {...field} icon={<CalendarIcon />} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col mb-4">
                                    <DateTimePicker defaultValue={field.value} disabled={disabled} disabledDate={!currentTypeLabel} title="Đến" {...field} icon={<CalendarIcon />} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="goal_id"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                        disabled={disabled}
                                    >
                                        <SelectTrigger className="w-full rounded-sm disabled:opacity-100 disabled:cursor-not-allowed">
                                            <SelectValue placeholder="Chọn mục tiêu" />
                                        </SelectTrigger>
                                        <SelectContent className="z-160">
                                            <SelectGroup>
                                                <SelectItem value={"0"}>Không Mục tiêu</SelectItem>
                                                <SelectItem value="6925c69c83828e4ac22388fa">Mục tiêu 2</SelectItem>
                                                <SelectItem value="6925c73183828e4ac22388fb">Mục tiêu 1</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                    </div>
                </div>
                <Label className="text-lg my-5 text-[#FFF583] font-bold border-t-2 pt-4">Nhãn Dán & Danh Mục</Label>
                <div className="ml-8 flex gap-5 border-b-2 pb-7">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex justify-between w-full">
                            <div className="flex gap-3 items-center">
                                <p className={titleLabel}>Loại công việc</p>
                                <FormField
                                    control={form.control}
                                    name="type_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <LabelSelector onchange={field.onChange} onchangeObject={(selectedKey) => {
                                                if (selectedKey === "REPEATED") {
                                                    setCurrentTypeLabel(true);
                                                }
                                                else {
                                                    setCurrentTypeLabel(false);
                                                }
                                            }} disable={disabled} color={labelDefaultData?.type.color || "#E8E8E8"} keyIcon={labelDefaultData?.type.key || "IN_DAY"} label={labelDefaultData?.type.name || "Trong Ngày"} label_type={labelDefaultData?.type.label_type || 1} classNameContentLabel="z-161" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <InfoPopover label="WorkType" />
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex gap-3 items-center">
                                <p className={titleLabel}>Trạng thái</p>
                                <FormField
                                    control={form.control}
                                    name="status_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <LabelSelector disable={disabled} onchange={field.onChange} color={labelDefaultData?.status.color || "#FFEA00"} keyIcon={labelDefaultData?.status.key || "PENDING"} label={labelDefaultData?.status.name || "Chờ làm"} label_type={labelDefaultData?.status.label_type || 2} classNameContentLabel="z-161" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <InfoPopover label="Status" />
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex gap-3 items-center">
                                <p className={titleLabel}>Mức độ khó</p>
                                <FormField
                                    control={form.control}
                                    name="difficulty_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <LabelSelector onchange={field.onChange} disable={disabled} color={labelDefaultData?.difficulty.color || "#13C540"} keyIcon={labelDefaultData?.difficulty.key || "EASY"} label={labelDefaultData?.difficulty.name || "Dễ"} label_type={labelDefaultData?.difficulty.label_type || 3} classNameContentLabel="z-161" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <InfoPopover label="Difficulty" />
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex gap-3 items-center">
                                <p className={titleLabel}>Mức độ ưu tiên</p>

                                <FormField
                                    control={form.control}
                                    name="priority_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <LabelSelector onchange={field.onChange} disable={disabled} color={labelDefaultData?.priority.color || "#13C540"} keyIcon={labelDefaultData?.priority.key || "IMPORTANT_NOT_URGENT"} label={labelDefaultData?.priority.name || "Quan trọng & Không khẩn cấp"} label_type={labelDefaultData?.priority.label_type || 4} classNameContentLabel="z-161" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <InfoPopover label="Priority" />
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex gap-3 items-center">
                                <p className={titleLabel}>Danh mục</p>
                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <LabelSelector onchange={field.onChange} disable={disabled} color={labelDefaultData?.category.color || "#3B82F6"} keyIcon={labelDefaultData?.category.key || "WORK"} label={labelDefaultData?.category.name || "Công việc"} label_type={labelDefaultData?.category.label_type || 5} classNameContentLabel="z-161" />
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
                        name="sub_tasks"
                        render={({ field }) => (
                            <FormItem>
                                <div>
                                    <MiniTask  {...field} onChange={field.onChange} disable={disabled} />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="basis-1/3">
                <Label className="text-lg mb-5 text-[#97FB99] font-bold">Mô tả công việc</Label>
                <div className="ml-8 border-b-1 pb-7">
                    <FormField
                        control={form.control}
                        name="short_descriptions"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mb-4">
                                <Textarea
                                    disabled={disabled}
                                    className="border-dashed disabled:opacity-100 disabled:cursor-not-allowed"
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
                                    disabled={disabled}
                                    className="border-dashed w-full h-32 disabled:opacity-100 disabled:cursor-not-allowed"
                                    {...field}
                                    placeholder="Mô tả chi tiết"
                                    id={field.name}
                                    rows={8}
                                />
                            </FormItem>
                        )}
                    />
                </div>
                <Label className="text-lg my-5 text-[#FFBF9C] font-bold">Cài đặt thông báo</Label>
                <div className="flex flex-col gap-10 ml-8">

                    <FormField
                        control={form.control}
                        name="notifications"
                        render={({ field }) => {
                            const value = field.value ?? {
                                beforeFiveMinApp: false,
                                beforeThirtyMinApp: false,
                                beforeFiveMinEmail: false,
                                beforeThirtyMinEmail: false,
                            };
                            const appEnabled =
                                value.beforeFiveMinApp || value.beforeThirtyMinApp;
                            const emailEnabled =
                                value.beforeFiveMinEmail || value.beforeThirtyMinEmail;

                            return (
                                <FormItem>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold">Thông báo ứng dụng</p>
                                            <Switch
                                                disabled={disabled}
                                                checked={appEnabled}
                                                onCheckedChange={(checked) => {
                                                    if (!checked) {
                                                        field.onChange({
                                                            ...field.value,
                                                            beforeFiveMinApp: false,
                                                            beforeThirtyMinApp: false,
                                                        });
                                                    } else {
                                                        field.onChange({
                                                            ...field.value,
                                                            beforeFiveMinApp: true,
                                                        });
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className="mt-4 opacity-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Checkbox
                                                    disabled={!appEnabled || disabled}
                                                    checked={value.beforeFiveMinApp}
                                                    onCheckedChange={(checked) =>
                                                        field.onChange({
                                                            ...field.value,
                                                            beforeFiveMinApp: checked,
                                                        })
                                                    }
                                                />
                                                <Label className={!appEnabled ? "opacity-40" : ""}>Trước 5 phút</Label>
                                            </div>

                                            <div className="flex items-center gap-3 mb-2">
                                                <Checkbox
                                                    disabled={!appEnabled || disabled}
                                                    checked={value.beforeThirtyMinApp}
                                                    onCheckedChange={(checked) =>
                                                        field.onChange({
                                                            ...field.value,
                                                            beforeThirtyMinApp: checked,
                                                        })
                                                    }
                                                />
                                                <Label className={!appEnabled ? "opacity-40" : ""}>Trước 30 phút</Label>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-6">
                                            <p className="font-bold">Thông báo email</p>
                                            <Switch
                                                disabled={disabled}
                                                checked={emailEnabled}
                                                onCheckedChange={(checked) => {
                                                    if (!checked) {
                                                        field.onChange({
                                                            ...field.value,
                                                            beforeFiveMinEmail: false,
                                                            beforeThirtyMinEmail: false,
                                                        });
                                                    } else {
                                                        field.onChange({
                                                            ...field.value,
                                                            beforeFiveMinEmail: true,
                                                        });
                                                    }
                                                }}
                                            />
                                        </div>

                                        <RadioGroup
                                            disabled={!emailEnabled || disabled}
                                            onValueChange={(val) => {
                                                field.onChange({
                                                    ...field.value,
                                                    beforeFiveMinEmail: val === "5",
                                                    beforeThirtyMinEmail: val === "30",
                                                });
                                            }}
                                            value={
                                                value.beforeFiveMinEmail ? "5" :
                                                    value.beforeThirtyMinEmail ? "30" :
                                                        undefined
                                            }
                                            className={!emailEnabled ? "opacity-40" : ""}
                                        >
                                            <div className="flex items-center gap-3 mt-4 mb-2">
                                                <RadioGroupItem value="5" disabled={!emailEnabled || disabled} />
                                                <Label>Trước 5 phút</Label>
                                            </div>

                                            <div className="flex items-center gap-3 mb-2">
                                                <RadioGroupItem value="30" disabled={!emailEnabled || disabled} />
                                                <Label>Trước 30 phút</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </FormItem>
                            );
                        }}
                    />
                </div>
            </div>

        </div>
    </>)
}

export default UpsertScheduleForm