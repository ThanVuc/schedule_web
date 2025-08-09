"use client";
import { AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { CreateRoleMutationResponseType, UpsertRoleSchema } from "../models"
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpsertRoleForm } from "../components";
import { Form } from "@/components/ui";
import { useAxiosMutation, useConfirmDialog, } from "@/hooks";
import { roleApiUrl } from "@/api"
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../hooks";

export interface AddRoleProps {
    refetch?: () => void;
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

    const buttonData = buttonProps[mode as keyof typeof buttonProps] ?? buttonProps.create;

    const { sendRequest } = useAxiosMutation<CreateRoleMutationResponseType, z.infer<typeof UpsertRoleSchema>>({
        method: "POST",
        url: roleApiUrl.createRole,
        headers: {
            "Content-Type": "application/json"
        }
    });

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
            permission_ids: []
        }
    });

    const onSubmit = async (values: z.infer<typeof UpsertRoleSchema>) => {
        if (isDisabled) return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
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
            form.reset();
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
                        <UpsertRoleForm isDisabled={isDisabled} form={form} />
                    </form>
                </Form>
            </AppDialog>
            {dialog}
        </>
    );
}