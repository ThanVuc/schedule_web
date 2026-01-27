import z from "zod";
import { recoverySchema } from "../_models/schema/recovery.schema";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { FormField, FormItem, FormMessage } from "@/components/ui";
import { DateTimePicker } from "@/components/common/dateTimePicker";
import { CalendarIcon } from "@/components/icon";

type RecoveryForm = z.infer<typeof recoverySchema>;

interface RecoveryFormProps {
    form: UseFormReturn<RecoveryForm>;
}
const RecoveryForm = ({ form }: RecoveryFormProps) => {
    const getDate = form.watch("target_date");
    const applyDate = form.watch("source_date");
    const formatDate = (value?: number) => {
        if (!value) return "";
        return new Date(value).toLocaleDateString("vi-VN");
    };
    return (
        <div className="space-y-6">
            <Label className="text-white font-bold text-lg">
                Bạn có chắc muốn khôi phục công việc của ngày:{" "}
                <span className="text-yellow-400">
                    {getDate ? formatDate(getDate) : "--/--/----"}
                </span>{" "}
                cho ngày:{" "}
                <span className="text-yellow-400">
                    {applyDate ? formatDate(applyDate) : "--/--/----"}
                </span>{" "}
                không?
            </Label>
            <div className="grid grid-cols-[160px_1fr] items-center gap-4 mt-6">
                <Label className="text-white font-medium">
                    Ngày lấy dữ liệu
                </Label>
                <FormField
                    control={form.control}
                    name="source_date"
                    render={({ field }) => (
                        <FormItem>
                             <DateTimePicker defaultValue={field.value} disabledTime {...field} icon={<CalendarIcon />} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                <Label className="text-white font-medium">
                    Ngày áp dụng
                </Label>
                <FormField
                    control={form.control}
                    name="target_date"
                    render={({ field }) => (
                        <FormItem>
                            <DateTimePicker defaultValue={field.value} disabledTime {...field} icon={<CalendarIcon />} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

export default RecoveryForm;
