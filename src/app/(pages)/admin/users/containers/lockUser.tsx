"use client";
import { AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui";
import {  useAxiosMutation, useConfirmDialog, } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../permissions/hooks";
import { LockUserForm } from "../components/lockUserForm";
import { LockUserSchema } from "../models/schema/lockUser.schema";
import { lockUsersMutationResponseType } from "../models";
import { userApiUrl } from "@/api/users.api";

export interface AddUserProps {
    refetch?: () => void;
}

const buttonProps = {
    lock: {
        title: "Khóa người dùng",
        description: "Bạn có chắc chắn muốn khóa người dùng này?",
        submitButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
    },
};



export const LockUser = ({
    refetch,
}: AddUserProps) => {
    const { setToast } = useToastState();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mode, id } = useModalParams();
    const openDialog = mode === "lock";
    const { confirm, dialog } = useConfirmDialog();
    const buttonData = buttonProps[mode as keyof typeof buttonProps] ?? buttonProps.lock;

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/admin/users?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }

    const { sendRequest } = useAxiosMutation<lockUsersMutationResponseType,z.infer<typeof LockUserSchema>>({
        method: "PUT",
        url: userApiUrl.lockUser,
         headers: {
            "Content-Type": "application/json"
        }
    })

    const form = useForm<z.infer<typeof LockUserSchema>>({
        resolver: zodResolver(LockUserSchema),
        defaultValues: {
            lock_reason: "",
        }
    });

    const handleGranting = async (values: z.infer<typeof LockUserSchema>, id: string) => {
        const { data, error } = await sendRequest({ ...values, user_id: id });

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
                message: "Vai trò đã được cập nhật trạng thái thành công",
                variant: "success",
                closeable: true
            });
            if (refetch) {
                refetch();
            }
        }

    }
    const onSubmit = async (values: z.infer<typeof LockUserSchema>) => {
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        if (mode === "lock" && id) {
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
                height="small"
                onClose={closeModal}
                onSubmit={() => {
                    form.handleSubmit(onSubmit)();
                }}
                submitButtonText={buttonData.submitButtonText}
                cancelButtonText={buttonData.cancelButtonText}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <LockUserForm form={form} />
                    </form>
                </Form>
            </AppDialog>
            {dialog}
        </>
    );
}