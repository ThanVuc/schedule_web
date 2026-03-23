import { CreateWorkBacklogSchema } from "@/app/(pages)/te/_models/works/schema/CreateWorkBacklog.chema";
import { DateTimePicker } from "@/components/common/dateTimePicker";
import { FormField, FormMessage, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

type CreateWorkBacklogForm = z.infer<typeof CreateWorkBacklogSchema>;
interface CreateWorkBacklogFormProps {
    form: UseFormReturn<CreateWorkBacklogForm>;
}

const labelClassName = "text-xs font-medium text-[#C9D4E4]";
const controlClassName = "h-9 rounded-lg border border-[#1D2C43] bg-[#0F1A2F] px-3 text-sm text-white placeholder:text-[#60708A] focus-visible:ring-1 focus-visible:ring-[#2B79C2] focus-visible:border-[#2B79C2]";
const selectClassName = "h-9 rounded-lg border border-[#1D2C43] bg-[#0F1A2F] px-3 text-sm text-white data-[placeholder]:text-[#60708A] focus:ring-1 focus:ring-[#2B79C2] focus:border-[#2B79C2]";

const CreateWorkBacklogForm = ({ form }: CreateWorkBacklogFormProps) => {
    return (<div className="space-y-4">
        <div className="space-y-1.5">
            <Label className={labelClassName}>Tên công việc</Label>
            <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                    <div className="space-y-1">
                        <Input
                            {...field}
                            type="text"
                            placeholder="Ví dụ: Thiết kế trang đăng nhập"
                            maxLength={500}
                            className={controlClassName}
                        />
                        <FormMessage className="text-xs" />
                    </div>
                )}
            />
        </div>

        <div className="space-y-1.5">
            <Label className={labelClassName}>Mô tả</Label>
            <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                    <div className="space-y-1">
                        <Textarea
                            {...field}
                            placeholder="Nhập mô tả chi tiết cho công việc"
                            maxLength={5000}
                            className="min-h-[84px] resize-none rounded-lg border border-[#1D2C43] bg-[#0F1A2F] px-3 py-2 text-sm text-white placeholder:text-[#60708A] focus-visible:ring-1 focus-visible:ring-[#2B79C2] focus-visible:border-[#2B79C2]"
                        />
                        <FormMessage className="text-xs" />
                    </div>
                )}
            />
        </div>

        <div className="space-y-1.5">
            <Label className={labelClassName}>Người được giao</Label>
            <FormField
                name="Assignee_id"
                control={form.control}
                render={({ field }) => (
                    <div className="space-y-1">
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={selectClassName}>
                                <SelectValue placeholder="Chọn người được giao" />
                            </SelectTrigger>
                            <SelectContent className="z-200">
                                <SelectGroup>
                                    <SelectItem value="thanhvien1">Thành viên 1</SelectItem>
                                    <SelectItem value="thanhvien2">Thành viên 2</SelectItem>
                                    <SelectItem value="thanhvien3">Thành viên 3</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                    </div>
                )}
            />
        </div>

        <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
                <Label className={labelClassName}>Trạng thái</Label>
                <FormField
                    name="Status"
                    control={form.control}
                    render={({ field }) => (
                        <div className="space-y-1">
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <SelectTrigger className={selectClassName}>
                                    <SelectValue placeholder="Todo" />
                                </SelectTrigger>
                                <SelectContent className="z-200">
                                    <SelectGroup>
                                        <SelectItem value="1">Todo</SelectItem>
                                        <SelectItem value="2">Đang thực hiện</SelectItem>
                                        <SelectItem value="3">Đang kiểm tra</SelectItem>
                                        <SelectItem value="4">Hoàn thành</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                        </div>
                    )}
                />
            </div>

            <div className="space-y-1.5">
                <Label className={labelClassName}>Ưu tiên</Label>
                <FormField
                    name="Priority"
                    control={form.control}
                    render={({ field }) => (
                        <div className="space-y-1">
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <SelectTrigger className={selectClassName}>
                                    <SelectValue placeholder="Trung bình" />
                                </SelectTrigger>
                                <SelectContent className="z-200">
                                    <SelectGroup>
                                        <SelectItem value="1">Thấp</SelectItem>
                                        <SelectItem value="2">Trung bình</SelectItem>
                                        <SelectItem value="3">Cao</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                        </div>
                    )}
                />
            </div>

            <div className="space-y-1.5">
                <Label className={labelClassName}>Điểm ước lượng</Label>
                <FormField
                    name="Story_point"
                    control={form.control}
                    render={({ field }) => (
                        <div className="space-y-1">
                            <Input

                                {...field}
                                type="number"
                                min={1}
                                className={`${controlClassName} w-17`}
                            />
                            <FormMessage className="text-xs" />
                        </div>
                    )}
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
                <Label className={labelClassName}>Hạn hoàn thành</Label>
                <FormField
                    name="Due_date"
                    control={form.control}
                    render={({ field }) => (
                        <div className="space-y-1">
                            <div className="[&>button]:h-9 [&>button]:rounded-lg [&>button]:border [&>button]:border-[#1D2C43] [&>button]:bg-[#0F1A2F] [&>button]:px-3 [&>button]:text-sm [&>button]:text-[#C9D4E4] [&>button]:hover:bg-[#0F1A2F]">
                                <DateTimePicker defaultValue={Number(field.value)}
                                    onChange={field.onChange} disabledTime />
                            </div>
                            <FormMessage className="text-xs" />
                        </div>
                    )}
                />
            </div>

            <div className="space-y-1.5">
                <Label className={labelClassName}>Sprint</Label>
                <FormField
                    name="Sprint_id"
                    control={form.control}
                    render={({ field }) => (
                        <div className="space-y-1">
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className={selectClassName}>
                                    <SelectValue placeholder="Backlog" />
                                </SelectTrigger>
                                <SelectContent className="z-200">
                                    <SelectGroup>
                                        <SelectItem value="sprint1">Backlog</SelectItem>
                                        <SelectItem value="sprint2">Sprint 1</SelectItem>
                                        <SelectItem value="sprint3">Sprint 2</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                        </div>
                    )}
                />
            </div>
        </div>
    </div>);
}

export default CreateWorkBacklogForm;