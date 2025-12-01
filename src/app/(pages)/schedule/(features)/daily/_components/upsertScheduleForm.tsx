import z from "zod";
import { upsertScheduleSchema } from "../_models/schema";
import { UseFormReturn } from "react-hook-form";
import { Checkbox, FormField, FormItem, FormMessage, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from "@/components/ui";
import { DateTimePicker } from "@/components/common/dateTimePicker";
import { CalendarIcon } from "@/components/icon";
import { WorkLabel } from "../../../_components";
import InfoPopover from "./infoPopover";
import MiniTask from "../../../_components/miniTask/miniTask";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

type ScheduleForm = z.infer<typeof upsertScheduleSchema>
interface UpsertScheduleFormProps {
    form: UseFormReturn<ScheduleForm>
}
const UpsertScheduleForm = ({ form }: UpsertScheduleFormProps) => {
    const titleLabel = "border-2 p-2 rounded-md bg-white/10 md:min-w-35 max-w-21"
    const [disabledMail, setDisabledMail] = useState(false)
    const [selectedValue, setSelectedValue] = useState<string | null>(null)
    const [disabledApp, setDisabledApp] = useState(false)
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
                                <Input {...field} className="rounded-sm" placeholder="Tên công việc" id={field.name} />
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
                                    <DateTimePicker title="Từ" {...field} icon={<CalendarIcon />} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col mb-4">
                                    <DateTimePicker title="Đến" {...field} icon={<CalendarIcon />} />
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
                                    >
                                        <SelectTrigger className="w-full rounded-sm">
                                            <SelectValue placeholder="Chọn mục tiêu" />
                                        </SelectTrigger>
                                        <SelectContent className="z-160">
                                            <SelectGroup>
                                                <SelectItem value="6925c73183828e4ac22388fb">Mục tiêu 1</SelectItem>
                                                <SelectItem value="6925c69c83828e4ac22388fa">Mục tiêu 2</SelectItem>
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
                                            <WorkLabel onchange={field.onChange} color="#E8E8E8" icon="IN_DAY" label="Trong Ngày" label_type={1} classNameContentLabel="z-161" />
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
                                            <WorkLabel onchange={field.onChange} color="#FFEA00" icon="PENDING" label="Chờ làm" label_type={2} classNameContentLabel="z-161" />
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
                                            <WorkLabel onchange={field.onChange} color="#13C540" icon="EASY" label="Dễ" label_type={3} classNameContentLabel="z-161" />
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
                                            <WorkLabel onchange={field.onChange} color="#13C540" icon="IMPORTANT_NOT_URGENT" label="Quan trọng & Không khẩn cấp" label_type={4} classNameContentLabel="z-161" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <InfoPopover label="Category" />
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex gap-3 items-center">
                                <p className={titleLabel}>Danh mục</p>
                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <WorkLabel onchange={field.onChange} color="#3B82F6" icon="WORK" label="Công việc" label_type={5} classNameContentLabel="z-161" />
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
                                    <MiniTask {...field} />
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
                <Label className="text-lg my-5 text-[#FFBF9C] font-bold">Cài đặt thông báo</Label>
                <div className="flex flex-col gap-10 ml-8">

                    <FormField
                        control={form.control}
                        name="appNotifications"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold text-xl">Thông báo ứng dụng</Label>
                                    <Switch
                                        onCheckedChange={(checked) => {
                                            setDisabledApp(!checked)
                                            if (!checked) {
                                                field.onChange([])
                                            }
                                        }}
                                    />
                                </div>

                                <div className="flex mt-2 items-center">
                                    <Checkbox
                                        checked={field.value?.includes("5-minutes")}
                                        disabled={disabledApp}
                                        onCheckedChange={(checked) => {
                                            if (disabledApp) return
                                            const newValues = checked ? [...(field.value || []), "5-minutes"] : (field.value || []).filter((v) => v !== "5-minutes")
                                            field.onChange(newValues)
                                        }}
                                    />
                                    <Label htmlFor="app-5-minutes" className="ml-2">
                                        Trước 5 phút
                                    </Label>
                                </div>

                                <div className="flex mt-2 items-center">
                                    <Checkbox
                                        checked={field.value?.includes("30-minutes")}
                                        disabled={disabledApp}
                                        onCheckedChange={(checked) => {
                                            if (disabledApp) return
                                            const newValues = checked ? [...(field.value || []), "30-minutes"] : (field.value || []).filter((v) => v !== "30-minutes")
                                            field.onChange(newValues)
                                        }}
                                    />
                                    <Label htmlFor="app-30-minutes" className="ml-2">
                                        Trước 30 phút
                                    </Label>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="emailNotifications"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold text-xl">Thông báo email</Label>
                                    <Switch
                                        onCheckedChange={(checked) => {
                                            setDisabledMail(!checked)
                                            if (checked) {
                                                const defaultValue = "5-minutes"
                                                setSelectedValue(defaultValue)
                                                field.onChange(defaultValue)
                                            } else {
                                                setSelectedValue(null)
                                                field.onChange(null)
                                            }
                                        }}
                                    />
                                </div>

                                <RadioGroup
                                    className="mt-4"
                                    disabled={disabledMail}
                                    value={selectedValue ?? ""}
                                    onValueChange={(value) => {
                                        const newValue = selectedValue === value ? null : value
                                        setSelectedValue(newValue)
                                        field.onChange(newValue)
                                    }}
                                >
                                    <div className="flex mt-2 items-center">
                                        <RadioGroupItem value="5-minutes" id="email-5-minutes" />
                                        <Label htmlFor="email-5-minutes" className="ml-2">
                                            Trước 5 phút
                                        </Label>
                                    </div>

                                    <div className="flex mt-2 items-center">
                                        <RadioGroupItem value="30-minutes" id="email-30-minutes" />
                                        <Label htmlFor="email-30-minutes" className="ml-2">
                                            Trước 30 phút
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </FormItem>
                        )}
                    />

                </div>
                <div className="flex justify-end mt-10">
                    <button
                        type="button"
                        onClick={() => {
                            const values = form.getValues()
                            console.log("📋 Dữ liệu form hiện tại:", values)
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Test
                    </button>
                </div>
            </div>

        </div>
    </>)
}

export default UpsertScheduleForm