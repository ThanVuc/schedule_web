import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui"
import z from "zod"
import { UseFormReturn } from "react-hook-form"
import { UpsertUserSchema } from "../models/schema/sertUser.schema"
import {  ClockIcon, EmailIcon, RoleIcon } from "@/components/icon"

type UserForm = z.infer<typeof UpsertUserSchema>
interface AddUserFormProps {
    form: UseFormReturn<UserForm>
}
export const UpsertUserForm = ({ form, }: AddUserFormProps) => {
    
    return (
        <div >
            <div className="flex flex-col gap-3">
                <FormField
                    control={form.control}
                    name="img"
                    render={({  }) => (
                        <FormItem className="flex justify-center">
                            <FormControl >
                                <img className="w-40 h-40 object-cover border-4 rounded-full" src="/assets/e145d5f684c1d0a465722a583e09904e.jpg" alt="ảnh" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex justify-center">
                            <FormControl>
                                <p className="font-bold">{field.value}</p>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="flex justify-between  border-b pb-4">
                            <FormLabel className="w-50"><EmailIcon/> Email</FormLabel>
                            <FormControl>
                                <p className="font-bold">{field.value}</p>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="flex justify-between  border-b pb-4">
                            <FormLabel className="w-50"><RoleIcon/> Vai trò</FormLabel>
                            <FormControl>
                                <p className="font-bold">{Array.isArray(field.value) ? field.value.join(", ") : field.value}</p>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastLoginAt"
                    render={({ field }) => (
                        <FormItem className="flex justify-between  border-b pb-4">
                            <FormLabel className="w-50"><ClockIcon/> Lần đăng nhập cuối</FormLabel>
                            <FormControl>
                                <p className="font-bold">{field.value}</p>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastUpdateAt"
                    render={({ field }) => (
                        <FormItem className="flex justify-between  border-b pb-4">
                            <FormLabel className="w-50"> <ClockIcon/> Thời gian cập nhật cuối</FormLabel>
                            <FormControl>
                                <p className="font-bold">{field.value}</p>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="createdAt"
                    render={({ field }) => (
                        <FormItem className="flex justify-between  border-b pb-4">
                            <FormLabel className="w-50"><ClockIcon/> Thời gian tạo</FormLabel>
                            <FormControl>
                                <p className="font-bold">{field.value}</p>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}