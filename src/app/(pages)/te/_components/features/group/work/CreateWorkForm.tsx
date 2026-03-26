import { CreateWorkSchema } from "@/app/(pages)/te/_models/works/schema";
import { FormField, FormMessage, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

type CreateWorkForm = z.infer<typeof CreateWorkSchema>;
interface CreateWorkFormProps {
    form: UseFormReturn<CreateWorkForm>;
}

const CreateWorkForm = ({ form }: CreateWorkFormProps) => {
    return (<>
        <div className="mb-3">
            <label className="text-xs font-medium pb-2 block">Tên công việc</label>
            <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                    <div>
                        <Input
                            {...field}
                            type="text"
                            placeholder="Nhập tên công việc của bạn"
                            maxLength={500}
                            className="w-full rounded-lg border border-[#1E2A3A] bg-[#111820] px-3 py-2 text-sm
                                                   text-white placeholder:text-gray-600 focus:outline-none
                                                   focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]/40 transition-colors"
                        />
                        <FormMessage />
                    </div>
                )}
            />
        </div>
        <div className="mb-3">
            <label className="text-xs font-medium pb-2 block">Mô tả</label>
            <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                    <div>
                        <Textarea
                            {...field}
                            placeholder="Nhập mô tả công việc của bạn"
                            maxLength={5000}
                            className="w-full rounded-lg border border-[#1E2A3A] bg-[#111820] px-3 py-2 text-sm
                                               text-white placeholder:text-gray-600 focus:outline-none
                                               focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]/40 transition-colors"
                        />
                        <FormMessage />
                    </div>
                )}
            />
        </div>
        <div>
            <Label className="text-xs font-medium pb-2 block">Sprint</Label>
            <FormField
                name="Sprint_id"
                control={form.control}
                render={({ field }) => (
                    <div>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full rounded-lg border border-[#1E2A3A] bg-[#111820] px-3 py-2 text-sm text-white focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]/40 transition-colors">
                            <SelectValue placeholder="Chọn Sprint" />
                        </SelectTrigger>
                        <SelectContent className="w-full z-200">
                            <SelectGroup className="z-200 w-full">
                                <SelectItem value="sprint1">Sprint 1</SelectItem>
                                <SelectItem value="sprint2">Sprint 2</SelectItem>
                                <SelectItem value="sprint3">Sprint 3</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </div>
                )}
            />
        </div>
    </>);
}

export default CreateWorkForm;