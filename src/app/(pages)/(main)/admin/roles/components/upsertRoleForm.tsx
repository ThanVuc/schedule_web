import { Button, Checkbox, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from "@/components/ui"
import z from "zod"
import { UpsertRoleSchema } from "../models"
import { UseFormReturn } from "react-hook-form"
import { useState } from "react"
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

const permissionsExample = [
    { id: "1", name: "Xem người dùng", description: "Cho phép xem danh sách người dùng" },
    { id: "2", name: "Chỉnh sửa người dùng", description: "Cho phép chỉnh sửa thông tin người dùng" },
    { id: "3", name: "Xóa người dùng", description: "Cho phép xóa người dùng khỏi hệ thống" },
    { id: "4", name: "Xem vai trò", description: "Cho phép xem các vai trò hiện có" },
    { id: "5", name: "Chỉnh sửa vai trò", description: "Cho phép chỉnh sửa thông tin vai trò" },
    { id: "6", name: "Xóa vai trò", description: "Cho phép xóa vai trò khỏi hệ thống" },
    { id: "7", name: "Xem người dùng 1", description: "Cho phép xem danh sách người dùng" },
    { id: "8", name: "Chỉnh sửa người dùng 1", description: "Cho phép chỉnh sửa thông tin người dùng" },
    { id: "9", name: "Xóa người dùng 1", description: "Cho phép xóa người dùng khỏi hệ thống" },
    { id: "10", name: "Xem vai trò 1", description: "Cho phép xem các vai trò hiện có" },
    { id: "11", name: "Chỉnh sửa vai trò 1", description: "Cho phép chỉnh sửa thông tin vai trò" },
    { id: "12", name: "Xóa vai trò 1", description: "Cho phép xóa vai trò khỏi hệ thống" },
    { id: "13", name: "Xem báo cáo", description: "Cho phép xem các báo cáo" },
    { id: "14", name: "Chỉnh sửa báo cáo", description: "Cho phép chỉnh sửa báo cáo" },
    { id: "15", name: "Xóa báo cáo", description: "Cho phép xóa báo cáo khỏi hệ thống" },
    { id: "16", name: "Xem thống kê", description: "Cho phép xem thống kê" },
    { id: "17", name: "Chỉnh sửa thống kê", description: "Cho phép chỉnh sửa thống kê" },
    { id: "18", name: "Xóa thống kê", description: "Cho phép xóa thống kê khỏi hệ thống" },
    { id: "19", name: "Xem cài đặt", description: "Cho phép xem cài đặt hệ thống" },
    { id: "20", name: "Chỉnh sửa cài đặt", description: "Cho phép chỉnh sửa cài đặt hệ thống" },
    { id: "21", name: "Xóa cài đặt", description: "Cho phép xóa cài đặt khỏi hệ thống" },
    { id: "22", name: "Xem nhật ký", description: "Cho phép xem nhật ký hệ thống" },
    { id: "23", name: "Chỉnh sửa nhật ký", description: "Cho phép chỉnh sửa nhật ký hệ thống" },
    { id: "24", name: "Xóa nhật ký", description: "Cho phép xóa nhật ký khỏi hệ thống" },
    { id: "25", name: "Xem thông báo", description: "Cho phép xem các thông báo" },
    { id: "26", name: "Chỉnh sửa thông báo", description: "Cho phép chỉnh sửa thông báo" },
    { id: "27", name: "Xóa thông báo", description: "Cho phép xóa thông báo khỏi hệ thống" },
]

export const UpsertRoleForm = ({ form, permissions, isDisabled = false }: AddRoleFormProps) => {
    const [availablePermissions] = useState(permissions ?? permissionsExample);
    const [filteredPermissions, setFilteredPermissions] = useState(availablePermissions);
    const { setPage, startIndex, endIndex, pageIndex, hasNextPage, hasPreviousPage, totalPages } = useIndexPagination(filteredPermissions.length, 1, 8);

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
                                    permission.description.toLowerCase().includes(lowerQuery)
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