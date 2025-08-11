"use client";
import { AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { CreateRoleMutationResponseType, PermissionModel, RoleModel, UpdateRoleMutationResponseType, UpsertRoleSchema } from "../models"
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpsertRoleForm } from "../components";
import { Form } from "@/components/ui";
import { useAxios, useAxiosMutation, useConfirmDialog, } from "@/hooks";
import { permissionApiUrl, roleApiUrl } from "@/api"
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../hooks";
import { use, useEffect, useState } from "react";

export interface AddRoleProps {
    refetch?: () => void;
}
type FormPermisstion = {
    id: string;
    name: string;
    description: string;
}

const buttonProps = {
    create: {
        title: "Thêm Vai Trò Mới",
        description: "Nhập thông tin vai trò mới và lưu lại",
        submitButtonText: "Lưu",
        cancelButtonText: "Hủy Bỏ",
    },
    edit: {
        title: "Chỉnh Sửa Vai Trò",
        description: "Cập nhật thông tin vai trò",
        submitButtonText: "Cập Nhật",
        cancelButtonText: "Hủy Bỏ",
    },
    view: {
        title: "Xem Vai Trò",
        description: "Thông tin chi tiết về vai trò",
        submitButtonText: null,
        cancelButtonText: "Đóng",
    },
};

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


export const UpsertRole = ({
    refetch,
}: AddRoleProps) => {
    const { setToast } = useToastState();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mode, id } = useModalParams();
    const openDialog = mode === "create" || mode === "edit" || mode === "view";
    const isDisabled = mode === "view";
    const { confirm, dialog } = useConfirmDialog();
    const [permissionForm, setPermissionForm] = useState<PermissionModel[]>([]);
    const buttonData = buttonProps[mode as keyof typeof buttonProps] ?? buttonProps.create;
    const { sendRequest } = useAxiosMutation<CreateRoleMutationResponseType, z.infer<typeof UpsertRoleSchema>>({
        method: "POST",
        url: roleApiUrl.createRole,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const { data: dataGetById } = useAxios<{ role: RoleModel }>({
        method: "GET",
        url: `${roleApiUrl.getRoleById}/${id}`,
    },
        [id],
        id === null || mode === "create"
    );
    const { sendRequest: sendUpdateRequest } = useAxiosMutation<UpdateRoleMutationResponseType, z.infer<typeof UpsertRoleSchema>>({
        method: "PUT",
        url: roleApiUrl.updateRole,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const { data: permissionsData } = useAxios<{ items: PermissionModel[] }>({
        method: "GET",
        url: permissionApiUrl.getPermissions,
        params: { page_ignore: true }
    });
    const transformPermissions = (permissions: PermissionModel[]) => {
        return permissions.map(permission => ({
            perm_id: permission.perm_id,
            perm_name: permission.perm_name,
            description: permission.description
        }));
    };

    useEffect(() => {
       if (permissionsData?.items) {
         setPermissionForm(transformPermissions(permissionsData.items));

       }
        
    }, [permissionsData]);
    
    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/admin/roles?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }

    const form = useForm<z.infer<typeof UpsertRoleSchema>>({
        resolver: zodResolver(UpsertRoleSchema),
        defaultValues: {
            name: "",
            description: "",
            permission_ids: [dataGetById?.role?.permissions.map(permission => permission.perm_id) || []].flat(),
        }
    });
    useEffect(() => {
        if (mode !== "create" && dataGetById?.role) {
            form.reset({
                name: dataGetById.role.name,
                description: dataGetById.role.description || "",
                permission_ids: [dataGetById?.role?.permissions.map(permission => permission.perm_id) || []].flat(),
            });
        }
    }, [mode,dataGetById]);

      useEffect(() => {
        if (mode === "create") {
            form.reset(
                {
                    name: "",
                    description: "",
                    permission_ids: [],
                }
            );
        }
    }, [mode]);

    const handleCreate = async (values: z.infer<typeof UpsertRoleSchema>) => {
        const { data, error } = await sendRequest(values);

        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể thêm vai trò mới",
                variant: "error",
                closeable: false
            });
            return;
        }

        if (data?.is_success) {
            closeModal();
            setToast({
                title: "Thành công",
                message: "Vai trò đã được thêm thành công",
                variant: "success",
                closeable: true
            });
            if (refetch) {
                refetch();
            }
        }
    };

    const handleEdit = async (values: z.infer<typeof UpsertRoleSchema>) => {
        const { data, error } = await sendUpdateRequest(values);
         if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể cập nhật vai trò mới",
                variant: "error",
                closeable: false
            });
            return;
        }

        if (data?.is_success) {
            closeModal();
            form.reset();
            setToast({
                title: "Thành công",
                message: "Vai trò đã được cập nhật thành công",
                variant: "success",
                closeable: true
            });
            if (refetch) {
                refetch();
            }
        }
    }

    const onSubmit = async (values: z.infer<typeof UpsertRoleSchema>) => {
        if (isDisabled) return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;

        if (mode === "create") {
            await handleCreate(values);
        } else if (mode === "edit") {
            await handleEdit(values);
        }
    }
    return (
        <>
            <AppDialog
                dialogTitle={buttonData.title}
                dialogDescription={buttonData.description}
                open={openDialog}
                onClose={closeModal}
                onSubmit={() => {
                    form.handleSubmit(onSubmit)();
                }}
                submitButtonText={isDisabled ? null : buttonData.submitButtonText}
                cancelButtonText={buttonData.cancelButtonText}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <UpsertRoleForm isDisabled={isDisabled} permissions={permissionForm} form={form} />
                    </form>
                </Form>
            </AppDialog>
            {dialog}
        </>
    );
}