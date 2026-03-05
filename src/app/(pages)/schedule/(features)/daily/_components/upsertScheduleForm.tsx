import z from "zod";
import { upsertScheduleSchema } from "../_models/schema";
import { UseFormReturn } from "react-hook-form";
import { Checkbox, FormField, FormItem, FormMessage, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from "@/components/ui";
import InfoPopover from "./info/infoPopover";
import MiniTask from "../../../_components/miniTask/miniTask";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { label, labelDefault } from "../_models/type/label";
import { useEffect, useState } from "react";
import { LabelSelector } from "../../../_components";
import { goalList } from "../_models/type/mutation.type";
import TimePicker from "@/components/common/timePicker";
import DatepickerWithRange from "@/components/common/dateTimepickerWithRange";
import DraftLabel from "../../../_components/label";

type ScheduleForm = z.infer<typeof upsertScheduleSchema>
interface UpsertScheduleFormProps {
    form: UseFormReturn<ScheduleForm>
    labelDefaultData?: labelDefault
    disabled?: boolean
    goalList?: goalList[]
    draftLabel?: label
}
const UpsertScheduleForm = ({ form, labelDefaultData, disabled, goalList, draftLabel }: UpsertScheduleFormProps) => {
    const titleLabel = "border-2 p-2 rounded-md bg-white/10 min-w-[100px] md:min-w-35 text-xs md:text-sm text-center"
    const [currentTypeLabel, setCurrentTypeLabel] = useState(true);
    const type = labelDefaultData?.type.key;


    useEffect(() => {
        if (type === "REPEATED") {
            setCurrentTypeLabel(false);
        } else {
            setCurrentTypeLabel(true);
        }
    }, [type]);
    return (<>
        {draftLabel && (<DraftLabel className="text-xs" color={draftLabel?.color || ""} icon={draftLabel?.key || ""} label={draftLabel?.name || ""} />)}
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-10">
            <div className="w-full lg:basis-2/3">
                <Label className="text-base md:text-lg mb-3 md:mb-5 text-[#94FEF5] font-bold">Thông Tin Cơ Bản</Label>
                <div className="ml-2 md:ml-8">
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
                                    maxLength={126}
                                    id={field.name}
                                    disabled={disabled}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col md:flex-row justify-center items-stretch md:items-center w-full gap-3 md:gap-4">
                        <FormField
                            control={form.control}
                            name="start_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mb-4">
                                    <TimePicker
                                        title="Từ"
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                    />
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mb-4">
                                    <TimePicker
                                        title="Đến"
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                    />
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="repeat_range"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col mb-4 text-xs break-all line-clamp-1">
                                    <DatepickerWithRange
                                        disabled={currentTypeLabel}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    <FormMessage className="text-xs break-all line-clamp-1" />
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
                                                {goalList && goalList.map((goal) => (
                                                    <SelectItem key={goal.id} value={goal.id.toString()}>{goal.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Label className="text-base md:text-lg my-3 md:my-5 text-[#FFF583] font-bold border-t-2 pt-3 md:pt-4">Nhãn Dán & Danh Mục</Label>
                <div className="ml-2 md:ml-8 flex gap-3 md:gap-5 border-b-2 pb-5 md:pb-7">
                    <div className="flex flex-col gap-3 md:gap-4 w-full">
                        <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
                            <div className="flex gap-2 md:gap-3 items-center">
                                <p className={titleLabel}>Loại công việc</p>
                                <FormField
                                    control={form.control}
                                    name="type_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <LabelSelector onchange={field.onChange} onchangeObject={(selectedKey) => {
                                                if (selectedKey === "REPEATED") {
                                                    setCurrentTypeLabel(false);
                                                }
                                                else {
                                                    setCurrentTypeLabel(true);
                                                }
                                            }} disable={disabled} color={labelDefaultData?.type.color || "#E8E8E8"} keyIcon={labelDefaultData?.type.key || "IN_DAY"} label={labelDefaultData?.type.name || "Trong Ngày"} label_type={labelDefaultData?.type.label_type || 1} classNameContentLabel="z-161" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:block hidden"><InfoPopover label="WorkType" /></div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
                            <div className="flex gap-2 md:gap-3 items-center">
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
                            <div className="sm:block hidden"><InfoPopover label="Status" /></div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
                            <div className="flex gap-2 md:gap-3 items-center">
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
                            <div className="sm:block hidden"><InfoPopover label="Difficulty" /></div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
                            <div className="flex gap-2 md:gap-3 items-center">
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
                            <div className="sm:block hidden"><InfoPopover label="Priority" /></div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
                            <div className="flex gap-2 md:gap-3 items-center">
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
                            <div className="sm:block hidden"><InfoPopover label="Category" /></div>
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
            <div className="w-full lg:basis-1/3">
                <Label className="text-base md:text-lg mb-3 md:mb-5 text-[#97FB99] font-bold">Mô tả công việc</Label>
                <div className="ml-2 md:ml-8 border-b-1 pb-5 md:pb-7">
                    <FormField
                        control={form.control}
                        name="short_descriptions"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mb-4">
                                <Textarea
                                    disabled={disabled}
                                    maxLength={256}
                                    className="
                                        border-dashed 
                                        h-18
                                        w-full
                                        sm:w-100
                                        resize-none
                                        whitespace-pre-wrap
                                        disabled:opacity-100 
                                        disabled:cursor-not-allowed
                                    "
                                    {...field}
                                    placeholder="Mô tả ngắn"
                                    id={field.name}
                                    rows={4}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="detailed_description"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mb-4">
                                <Textarea
                                    disabled={disabled}
                                    maxLength={512}
                                    className="border-dashed w-full sm:w-100 h-32 resize-none
                                        whitespace-pre-wrap disabled:opacity-100 disabled:cursor-not-allowed"
                                    {...field}
                                    placeholder="Mô tả chi tiết"
                                    id={field.name}
                                    rows={8}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Label className="text-base md:text-lg my-3 md:my-5 text-[#FFBF9C] font-bold">Cài đặt thông báo</Label>
                <div className="flex flex-col gap-6 md:gap-10 ml-2 md:ml-8">

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