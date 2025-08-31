"use client"
import { Button, Checkbox, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui"
import z from "zod"
import { UseFormReturn } from "react-hook-form"
import { GrantingSchema } from "../models/schema/granting.schema"
import { useEffect, useState } from "react"
import { AppSearchSimple, H4, Muted } from "@/components/common"
import { useIndexPagination } from "../../roles/hooks"

type UserForm = z.infer<typeof GrantingSchema>
interface GrantingFormProps {
    form: UseFormReturn<UserForm>,
    role?: {
        role_id: string
        name: string
        description: string
    }[]
}
export const GrantingForm = ({ form, role }: GrantingFormProps) => {
    
    const [availableRole, setavailableRole] = useState(role ?? []);
    const [filteredRole, setFilteredRole] = useState(availableRole);
    const { setPage, startIndex, endIndex, pageIndex, hasNextPage, hasPreviousPage, totalPages } = useIndexPagination(filteredRole.length, 1, 8);
    useEffect(() => {
        setavailableRole(role ?? []);
        setFilteredRole(role ?? []);
    }, [role]);

    return (
        <div >
            <div className="flex flex-col gap-10">
                <div className="border-2  rounded-2xl bg-[#000000]/10 flex flex-col items-start p-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex justify-center">
                                <FormLabel className="font-bold">Email:</FormLabel>
                                <FormControl>
                                    <p className="font-bold" {...field}>thaidaihuan@gmail.com</p>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                            <FormItem className="flex justify-center">
                                <FormLabel className="font-bold">ID người dùng:</FormLabel>
                                <FormControl>
                                    <p className="font-bold" {...field}>123e4567-e89b-12d3-a456-426614174000</p>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-7">
                        <H4 className="text-base sm:text-lg">Danh sách vai trò</H4>
                        <AppSearchSimple
                            placeholder="Tìm kiếm vai trò..."
                            onSearch={(query) => {
                                const lowerQuery = query.toLowerCase();
                                setFilteredRole(
                                    availableRole.filter(role =>
                                        role.name.toLowerCase().includes(lowerQuery) ||
                                        (role.description.toLowerCase() ?? "").includes(lowerQuery)
                                    )
                                );
                            }}
                            className="w-full sm:max-w-[15rem] flex-shrink-0"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b pb-4">
                        {
                            filteredRole.slice(startIndex, endIndex)?.map((role) => (
                                <FormField
                                    key={role.role_id}
                                    control={form.control}
                                    name="roleId"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <FormControl>
                                                <Checkbox className="h-5 w-5 border-gray-300"
                                                    checked={field.value?.includes(role.role_id)}
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked
                                                            ? [...(field.value ?? []), role.role_id]
                                                            : field.value?.filter((id) => id !== role.role_id)
                                                        field.onChange(newValue)
                                                    }}
                                                />
                                            </FormControl>
                                            <div>
                                                <FormLabel className="line-clamp-1 max-w-[180px]  break-all overflow-hidden">{role.name}</FormLabel>
                                                <FormDescription className=" line-clamp-1 break-all max-w-[300px] overflow-hidden">{role.description}</FormDescription>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))
                        }
                    </div>
                    <div className="flex items-center justify-end gap-4">
                    <Button type="button" disabled={!hasPreviousPage} variant="ghost" size="sm"
                        onClick={() => setPage(pageIndex - 1)}
                    >Trước</Button>
                    <Muted className="text-sm">Trang {totalPages !== 0 ? pageIndex : 0}/{totalPages}</Muted>
                    <Button type="button" disabled={!hasNextPage} variant="ghost" size="sm"
                        onClick={() => setPage(pageIndex + 1)}
                    >Sau</Button>
                </div>
                </div>
            </div>
        </div>
    )
}