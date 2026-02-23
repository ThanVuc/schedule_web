import z from "zod";
import { generateWorkAISchema } from "../_models/schema/generateWorkAI";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, Textarea } from "@/components/ui";
import { Label } from "@radix-ui/react-label";
import TaskAI from "../../../_components/taskAI/taskAI";
import { DateIcon, FourStarIcon } from "@/components/icon";
import InfoWorkAIPopover from "./info/infoWorkAI";
import InfoAdditional from "./info/infoAdditional";

type RecoveryForm = z.infer<typeof generateWorkAISchema>;
interface GenerateWorkAIFormProps {
    form: UseFormReturn<RecoveryForm>;
}
const GenerateWorkAIForm = ({ form }: GenerateWorkAIFormProps) => {
    return (<>
        <div >
            <div className=" mb-4">
                <div className="flex justify-between">
                    <Label className="flex gap-2 items-center text-lg">Thông tin công việc
                        <DateIcon className=" !h-5 !w-5 text-[#74D3FF]" />
                    </Label>
                    <InfoWorkAIPopover />
                </div>
                <FormField
                    control={form.control}
                    name="prompts"
                    render={({ field }) => (
                        <FormItem>
                            <TaskAI {...field} onChange={field.onChange} />
                        </FormItem>
                    )}
                />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Label className="flex gap-2 items-center text-lg">Thông tin bổ sung
                        <FourStarIcon className=" !h-5 !w-5 text-[#F4B9F5]" />
                    </Label>
                    <InfoAdditional />
                </div>
                <FormField
                    control={form.control}
                    name="additional_context"
                    render={({ field }) => (
                        <FormItem>
                            <div>
                                <Textarea {...field}
                                    className="
                                        border-dashed 
                                        h-40
                                        w-full
                                        resize-none break-all
                                        whitespace-pre-wrap
                                        disabled:opacity-100 
                                        disabled:cursor-not-allowed
                                    "
                                    placeholder="Cung cấp ngữ cảnh làm việc của bạn để chúng tôi có thể sinh ra công việc phù hợp hơn" />
                            </div>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    </>);
}

export default GenerateWorkAIForm;