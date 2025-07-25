"use client";
import { AppAlertDialog, AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { CreateRoleMutationResponseType, UpsertRoleSchema } from "../models"
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors } from "react-hook-form";
import { useState } from "react";
import { UpsertRoleForm } from "../components";
import { Form } from "@/components/ui";
import { useAxiousMutation } from "@/hooks";
import { roleApiUrl } from "@/api"

export interface AddRoleProps {
    trigger?: React.ReactNode;
    action: "upsert" | "view"
    id?: string;
    refetch?: () => void;
}

export const UpsertRole = ({
    trigger,
    action = "view",
    refetch,
}: AddRoleProps) => {
    const { setToast } = useToastState();
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const isDisabled = action === "view";
    const { data, sendRequest, error } = useAxiousMutation<CreateRoleMutationResponseType ,z.infer<typeof UpsertRoleSchema>>({
        method: "POST",
        url: roleApiUrl.createRole,
        headers: {
            "Content-Type": "application/json"
        }
    });

    const form = useForm<z.infer<typeof UpsertRoleSchema>>({
        resolver: zodResolver(UpsertRoleSchema),
        defaultValues: {
            name: "",
            description: "",
            permission_ids: []
        }
    });
    // validation passed
    const onSubmit = (values: z.infer<typeof UpsertRoleSchema>) => {
        console.log("Form submitted with values:", values);
        setOpenAlertDialog(true);
    }
    // validation failed
    const onError = (errors: FieldErrors<z.infer<typeof UpsertRoleSchema>>) => {
        console.warn("Validation errors:", errors);
    }
    // handle save action after confirmation
    const onSave = async () => {
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

        if (data?.is_success) {
            setToast({
                title: "Thành công",
                message: "Vai trò đã được thêm thành công",
                variant: "success",
                closeable: false
            });
        }

        setOpenDialog(false);
        setOpenAlertDialog(false);
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

    return (
        <>
            <AppDialog
                trigger={trigger}
                dialogTitle="Thêm Vai Trò Mới"
                dialogDescription="Nhập thông tin vai trò mới và lưu lại"
                open={openDialog}
                setOpen={setOpenDialog}
                onSubmit={() => {
                    // Trigger form validation and submission
                    form.handleSubmit(onSubmit, onError)();
                }}
                submitButtonText={isDisabled ? null : "Lưu"}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <UpsertRoleForm isDisabled={isDisabled} form={form} />
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