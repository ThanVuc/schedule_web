"use client";
import { AppAlertDialog, AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { CreateRoleMutationResponseType, UpsertRoleSchema } from "../models"
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { UpsertRoleForm } from "../components";
import { Form } from "@/components/ui";
import { useAxiosMutation, } from "@/hooks";
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
    const [openDialog, setOpenDialog] = useState(mode === "create" || mode === "edit" || mode === "view");
    const isDisabled = mode === "view";
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const buttonData = useMemo(() => {
        switch (mode) {
            case "create":
                return buttonProps.create;
            case "edit":
                return buttonProps.edit;
            case "view":
                return buttonProps.view;
            default:
                return buttonProps.create;
        }
    }, [mode]);

    useEffect(() => {
        setOpenDialog(!!mode || mode === "create" || mode === "edit" || mode === "view");
    }, [mode]);

    const { data, sendRequest, error } = useAxiosMutation<CreateRoleMutationResponseType, z.infer<typeof UpsertRoleSchema>>({
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

        router.push(`/admin/roles?${params.toString()}`, {scroll: false});
    }

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
                dialogTitle={buttonData.title}
                dialogDescription={buttonData.description}
                open={openDialog}
                setOpen={setOpenDialog}
                onClose={closeModal}
                onSubmit={() => {
                    form.handleSubmit(onSubmit, onError)();
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