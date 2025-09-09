"use client";
import { AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui";
import { useAxios, useAxiosMutation, useConfirmDialog, } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../permissions/hooks";
import { GrantingForm } from "../components";
import { GrantingSchema } from "../models/schema/granting.schema";
import {  useEffect, useState } from "react";
import { assignRoleUsersMutationResponseType, Role, UserModel } from "../models";
import { userApiUrl } from "@/api/users.api";
import { RoleSchema } from "../models/schema/listRole.schema";
import { getListRoleSchema } from "../models/schema/getlistRole.schema";

export interface AddUserProps {
    refetch?: () => void;
}

const buttonProps = {
    edit: {
        title: "Gán vai trò cho người dùng",
        description: "Chọn vai trò phù hợp cho người dùng trong hệ thống.",
        submitButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
    },
};



export const GrantingPermission = ({
    refetch,
}: AddUserProps) => {
    const { setToast } = useToastState();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mode, id } = useModalParams();
    const openDialog = mode === "edit";
    const isDisabled = mode === "view";
    const { confirm, dialog } = useConfirmDialog();
    const buttonData = buttonProps[mode as keyof typeof buttonProps] ?? buttonProps.edit;
    const [roleForm, setRoleForm] = useState<Role[]>([]);
    const { data: RoleData } = useAxios<{ items: Role[] }>({
        method: "GET",
        url: userApiUrl.getUserRoles,
    });
    const { sendRequest } = useAxiosMutation<assignRoleUsersMutationResponseType, z.infer<typeof GrantingSchema>>({
        method: "POST",
        url: userApiUrl.assignRole,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const { data: dataGetById, error: errorGetById } = useAxios<UserModel>({
        method: "GET",
        url: `${userApiUrl.getByIdUsers}/${id}`,
        headers: { "Content-Type": "application/json" },
    },
        [id],
        id === null || mode === "view"
    );



    useEffect(() => {
        if (RoleData) {
            setRoleForm(RoleData.items);
        }
    }, [RoleData]);


    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/admin/users?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }

    const form = useForm<z.infer<typeof getListRoleSchema>>({
        resolver: zodResolver(getListRoleSchema),
        defaultValues: {
            email: "",
            user_id: "",
            role_ids: []
        }
    });

    useEffect(() => {
        if (errorGetById) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không tìm thấy người dùng",
                variant: "error",
                closeable: false
            });
            closeModal();
        }
    }, []);

    useEffect(() => {
        if (dataGetById) {
            const roleIds = dataGetById.roles ? dataGetById.roles.map((role) => role.role_id) : [];
            form.reset({ 
                role_ids: roleIds,
                email: dataGetById.email ,
                user_id: dataGetById.user_id
            });
        }
    }, [dataGetById]);
    const handleGranting = async (values: z.infer<typeof RoleSchema>, userId: string) => {

        const valuesToSend = { ...values };
        if (valuesToSend.role_ids && valuesToSend.role_ids.length === 0) {
            valuesToSend.role_ids = [];
        }

        const { data, error } = await sendRequest({ ...values, user_id: userId });

        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể cập nhật vai trò mới",
                variant: "error",
                closeable: false
            });
            return;
        }
    
        if (data?.success) {
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
    const onSubmit = async (values: z.infer<typeof RoleSchema>) => {
        if (isDisabled) return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        if (mode === "edit" && id) {
            await handleGranting(values, id);
        }
    }
    return (
        <>
            <AppDialog
                dialogTitle={buttonData.title}
                dialogDescription={buttonData.description}
                open={openDialog}
                width="small"
                height="large"
                onClose={closeModal}
                onSubmit={() => {
                    form.handleSubmit(onSubmit)();
                }}
                submitButtonText={buttonData.submitButtonText}
                cancelButtonText={buttonData.cancelButtonText}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <GrantingForm form={form} role={roleForm} />
                    </form>
                </Form>
            </AppDialog>
            {dialog}
        </>
    );
}