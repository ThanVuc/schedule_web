"use client"
import { FormControl, FormField, FormItem,  FormMessage,  Textarea } from "@/components/ui"
import z from "zod"
import { UseFormReturn } from "react-hook-form"
import { LockUserSchema } from "../models/schema/lockUser.schema";

type UserForm = z.infer<typeof LockUserSchema>;
interface LockUserFormProps {
    form: UseFormReturn<UserForm>,
}
export const LockUserForm = ({ form }: LockUserFormProps) => {

    return (
        <div >
            <div className="flex flex-col gap-10">
                    <FormField
                        control={form.control}
                        name="lock_reason"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <Textarea maxLength={256} placeholder="Mô tả lý do" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                
            </div>
        </div>
    )
}