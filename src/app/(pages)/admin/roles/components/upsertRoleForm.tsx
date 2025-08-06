import { Button, Checkbox, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from "@/components/ui"
import z from "zod"
import { UpsertRoleSchema } from "../models"
import { UseFormReturn } from "react-hook-form"
import { useEffect, useState } from "react"
import { useIndexPagination } from "../hooks"
import { H4, Muted, AppSearchSimple } from "@/components/common"

type AddRoleForm = z.infer<typeof UpsertRoleSchema>
interface AddRoleFormProps {
    form: UseFormReturn<AddRoleForm>
    permissions?: {
        id: string
        name: string
        description: string
    }[]
    isDisabled?: boolean
}
export const UpsertRoleForm = ({ form, permissions, isDisabled = false }: AddRoleFormProps) => {
    const [availablePermissions, setAvailablePermissions] = useState(permissions ?? []);
    const [filteredPermissions, setFilteredPermissions] = useState(availablePermissions);
    const { setPage, startIndex, endIndex, pageIndex, hasNextPage, hasPreviousPage, totalPages } = useIndexPagination(filteredPermissions.length, 1, 8);

    useEffect(() => {
        setAvailablePermissions(permissions ?? []);
        setFilteredPermissions(permissions ?? []);
    }, [permissions]);

    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <div className="flex flex-col gap-4 w-full lg:w-2/5">
                <H4>Thông tin vai trò</H4>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên vai trò</FormLabel>
                            <FormControl>
                                <Input disabled={isDisabled} placeholder="Tên vai trò" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả vai trò</FormLabel>
                            <FormControl>
                                <Textarea maxLength={256} disabled={isDisabled} placeholder="Mô tả vai trò" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex flex-col gap-4 w-full lg:w-3/5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <H4 className="text-base sm:text-lg">Quyền hạn</H4>
                    <AppSearchSimple
                        placeholder="Tìm kiếm quyền hạn..."
                        onSearch={(query) => {
                            const lowerQuery = query.toLowerCase();
                            setFilteredPermissions(
                                availablePermissions.filter(permission =>
                                    permission.name.toLowerCase().includes(lowerQuery) ||
                                    (permission.description?.toLowerCase() ?? "").includes(lowerQuery)
                                )
                            );
                        }}
                        className="w-full sm:max-w-[15rem] flex-shrink-0"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b pb-4">
                    {
                        filteredPermissions.slice(startIndex, endIndex)?.map((permission) => (
                            <FormField
                                key={permission.id}
                                control={form.control}
                                name="permission_ids"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox disabled={isDisabled} className="h-5 w-5 border-gray-300"
                                                checked={field.value?.includes(permission.id)}
                                                onCheckedChange={(checked) => {
                                                    const newValue = checked
                                                        ? [...(field.value ?? []), permission.id]
                                                        : field.value?.filter((id) => id !== permission.id)
                                                    field.onChange(newValue)
                                                }}
                                            />
                                        </FormControl>
                                        <div>
                                            <FormLabel>{permission.name}</FormLabel>
                                            <FormDescription className="line-clamp-1">{permission.description}</FormDescription>
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
                    <Muted className="text-sm">Trang {pageIndex}/{totalPages}</Muted>
                    <Button type="button" disabled={!hasNextPage} variant="ghost" size="sm"
                        onClick={() => setPage(pageIndex + 1)}
                    >Sau</Button>
                </div>
            </div>
        </div>
    )
}