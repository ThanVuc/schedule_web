"use client";
import { AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui";
import { useConfirmDialog, } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../permissions/hooks";
import { UpsertUserSchema } from "../models/schema/sertUser.schema";
import { UpsertUserForm } from "../components/upsertUserForm";

export interface AddUserProps {
    refetch?: () => void;
}

const buttonProps = {
    view: {
        title: "Xem Vai Trò",
        description: "Thông tin chi tiết về vai trò",
        submitButtonText: null,
        cancelButtonText: "Đóng",
    },
};



export const UpsertUser = ({
    refetch,
}: AddUserProps) => {
    const { setToast } = useToastState();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mode, id } = useModalParams();
    const openDialog = mode === "view";
    const isDisabled = mode === "view";
    const { confirm, dialog } = useConfirmDialog();
    const buttonData =  buttonProps.view;

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/admin/users?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }

    const form = useForm<z.infer<typeof UpsertUserSchema>>({
        resolver: zodResolver(UpsertUserSchema),
        defaultValues: {
            name: "",
            email: "",
            LastLoginAt: "",
            LastUpdateAt: "",
            CreatedAt: "",
        }
    });
        const onSubmit = async () => {
            if (isDisabled) return;
            const isConfirmed = await confirm();
            if (!isConfirmed) return;
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
                submitButtonText={isDisabled ? null : buttonData.submitButtonText}
                cancelButtonText={buttonData.cancelButtonText}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <UpsertUserForm form={form}  />
                    </form>
                </Form>
            </AppDialog>
            {dialog}
        </>
    );
}