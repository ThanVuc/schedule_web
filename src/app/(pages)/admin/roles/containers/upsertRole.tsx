"use client";
import { AppAlertDialog, AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { CreateRoleMutationResponseType, PermissionModel, PermissionResponse, RoleModel, UpdateRoleMutationResponseType, UpsertRoleSchema } from "../models"
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors } from "react-hook-form";
import {  useEffect, useState } from "react";
import { UpsertRoleForm } from "../components";
import { Form } from "@/components/ui";
import { useAxios, useAxiosMutation, useAxiosWaitCall,  } from "@/hooks";
import { permissionApiUrl, roleApiUrl } from "@/api"
export interface AddRoleProps {
    trigger?: React.ReactNode;
    action: "create" | "update" | "view";
    id?: string;
    refetch?: () => void;
    dialogTitle?: string;
    dialogDescription?: string;
}
type FormPermission = {
    id: string;
    name: string;
    description: string;
};
export const UpsertRole = ({
    trigger,
    action,
    refetch,
    dialogTitle,
    dialogDescription,
    id,
}: AddRoleProps) => {
    const { setToast } = useToastState();
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [permissions, setPermissions] = useState<FormPermission[]>();
    const isDisabled = action === "view";
    const isUpdate = action === "update";
    const isCreate = action === "create";
    const { sendRequest, error } = useAxiosMutation<CreateRoleMutationResponseType, z.infer<typeof UpsertRoleSchema>>({
        method: "POST",
        url: roleApiUrl.createRole,
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    const { data: permissionsData, error: permissionsError, fetchData: fetchPermissionsData } = useAxiosWaitCall<PermissionResponse>({
        method: "GET",
        url: permissionApiUrl.getPermissions,
    });
    const { data: getByIdData, fetchData } = useAxiosWaitCall<{ role: RoleModel }>(
        {
            method: "Get",
            url: roleApiUrl.getRoleById,
        }

    );
    const { sendRequest: updateSendRequest, error: updateError } = useAxiosMutation<UpdateRoleMutationResponseType, z.infer<typeof UpsertRoleSchema>>({
        method: "PUT",
        url: roleApiUrl.updateRole,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const form = useForm<z.infer<typeof UpsertRoleSchema>>({
        resolver: zodResolver(UpsertRoleSchema),
        defaultValues: {
            name: "",
            description: "",
            permission_ids: [getByIdData?.role?.permissions?.map(perm => perm.perm_id) || []].flat(),
        }
    });
    const transformPermissions = (permissionsData: PermissionModel[]): FormPermission[] => {
        return permissionsData.map(perm => ({
            id: perm.perm_id,
            name: perm.perm_name,
            description: perm.description || "Không có mô tả"
        }));
    };
    useEffect(() => {
        if (permissionsData?.items) {
            const transformedPermissions = transformPermissions(permissionsData.items);
            setPermissions(transformedPermissions);
        }
    }, [permissionsData]);
    useEffect(() => {
        if (permissionsError) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể tải danh sách quyền",
                variant: "error",
                closeable: false
            });
        }
    }, [permissionsError]);
    useEffect(() => {
        if (getByIdData) {
            form.reset({
                name: getByIdData?.role?.name || "",
                description: getByIdData?.role?.description || "",
                permission_ids: getByIdData?.role?.permissions?.map(perm => perm.perm_id) || []
            });
        }
    }, [getByIdData]);
    useEffect(() => {
        if (openDialog)
        {
            if (fetchData && fetchPermissionsData ) {
                    fetchPermissionsData();
                fetchData(id);
            }
        }

    }, [openDialog]);

    useEffect(() => {
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể thêm vai trò mới",
                variant: "error",
                closeable: false
            });
        }
    }, [error, setToast]);
    const onSubmit = (values: z.infer<typeof UpsertRoleSchema>) => {
        setOpenAlertDialog(true);
    }
    const onError = (errors: FieldErrors<z.infer<typeof UpsertRoleSchema>>) => {
        console.warn("Validation errors:", errors);
    }
    const onSave = async () => {
        if (action === "create") {
            await sendRequest(form.getValues());
            if (error) {
                setToast({
                    title: "Lỗi hệ thống",
                    message: "Không thể thêm vai trò mới",
                    variant: "error",
                    closeable: false
                });
                return;
            }
            setToast({
                title: "Thành công",
                message: "Vai trò đã được thêm thành công",
                variant: "success",
                closeable: false
            });
        } else if (action === "update" && id) {
            await updateSendRequest(form.getValues(), id);
            if (updateError) {
                setToast({
                    title: "Lỗi hệ thống",
                    message: "Không thể cập nhật vai trò",
                    variant: "error",
                    closeable: false
                });
                return;
            }
            setToast({
                title: "Thành công",
                message: "Vai trò đã được cập nhật thành công",
                variant: "success",
                closeable: false
            });
        }

        setOpenDialog(false);
        setOpenAlertDialog(false);
        form.reset();
        if (refetch) refetch();
    };

    return (
        <>
            <AppDialog
                trigger={trigger}
                dialogTitle={dialogTitle}
                dialogDescription={dialogDescription}
                open={openDialog}
                setOpen={setOpenDialog}
                onSubmit={() => {
                    form.handleSubmit(onSubmit, onError)();
                }}
                submitButtonText={isDisabled ? null : "Lưu"}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <UpsertRoleForm isDisabled={isDisabled} permissions={permissions} form={form} />
                    </form>
                </Form>
            </AppDialog>
            <AppAlertDialog
                title="Xác nhận"
                description="Bạn có chắc chắn muốn lưu các thay đổi này?"
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                onSubmit={onSave}
            />
        </>
    );
}