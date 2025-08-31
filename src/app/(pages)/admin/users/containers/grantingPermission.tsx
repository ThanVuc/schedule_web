"use client";
import { AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui";
import { useAxios, useConfirmDialog, } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../permissions/hooks";
import { GrantingForm } from "../components";
import { GrantingSchema } from "../models/schema/granting.schema";
import { useEffect, useState } from "react";
import { Role } from "../models";
import { roleApiUrl } from "@/api";

export interface AddUserProps {
    refetch?: () => void;
}

const buttonProps = {
    grantingPermission: {
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
    const openDialog = mode === "grantingPermission";
    const { confirm, dialog } = useConfirmDialog();
    const buttonData = buttonProps.grantingPermission;
        const [roleForm, setRoleForm] = useState<Role[]>([]);
    
    
        const {data : RoleData} = useAxios<{items: Role[]}>({
            method: "GET",
            url: roleApiUrl.getRoles,
            params: { page_ignore: true }
        });
    
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

    const form = useForm<z.infer<typeof GrantingSchema>>({
        resolver: zodResolver(GrantingSchema),
        defaultValues: {
            userId: "",
            email: "",
            nameRole: "",
            description: "",
        }
    });

    const handleGranting = async (values: z.infer<typeof GrantingSchema>) => {
        const { data, error } = await sendRequest(values, id ?? undefined);
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
    const onSubmit = async (values: z.infer<typeof GrantingSchema>) => {
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        if (mode === "grantingPermission") {
            await handleGranting(values);
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
                submitButtonText={ buttonData.submitButtonText}
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