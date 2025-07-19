"use client";
import { AppAlertDialog, AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { UpsertRoleSchema } from "../models"
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors } from "react-hook-form";
import { useState } from "react";
import { UpsertRoleForm } from "../components";
import { Form } from "@/components/ui";

export interface AddRoleProps {
    trigger?: React.ReactNode;
    action: "upsert" | "view"
    id?: string;
}

export const UpsertRole = ({
    trigger,
    action = "view"
}: AddRoleProps) => {
    const { setToast } = useToastState();
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const isDisabled = action === "view";

    

    const form = useForm<z.infer<typeof UpsertRoleSchema>>({
        resolver: zodResolver(UpsertRoleSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: ['1','2','3']
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
    const onSave = () => {
        setOpenDialog(false);
        setOpenAlertDialog(false);
        const vals = form.getValues();
        console.log("Saving role:", vals);
        form.reset();
        setToast({
            title: "Thành công",
            message: "Vai trò đã được thêm thành công",
            variant: "success"
        });
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