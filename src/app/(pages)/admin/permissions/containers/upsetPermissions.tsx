"use client";

import React, { useState } from "react";
import { AppAlertDialog, AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { CreatePermissionMutationResponseType, UpsertPermissionSchema } from "../models";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui";
import { useAxiosMutation } from "@/hooks";
import { permissionApiUrl } from "@/api";
import { UpsertPermissionForm } from "../components";
import { z } from "zod";

export interface AddPermissionProps {
    trigger?: React.ReactNode;
    action: "upsert" | "view";
    id?: string;
    refetch?: () => void;
}

type UpsertPermissionInput = z.infer<typeof UpsertPermissionSchema>;
export type CreatePermissionPayload = {
    name: string;
    description?: string;
    resource_id: string;
    actions_ids: string[];
};

export const UpsertPermission: React.FC<AddPermissionProps> = ({
    trigger,
    action = "view",
    id,
    refetch,
}) => {
    const { setToast } = useToastState();
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);

    const isDisabled = action === "view";
    const isEdit = action === "upsert" && !!id;
    const isCreate = action === "upsert" && !id;

    const dialogTitle = isCreate
        ? "Thêm Quyền Mới"
        : isEdit
            ? "Chỉnh sửa quyền"
            : "Xem thông tin quyền";

    const dialogDescription = isCreate
        ? "Nhập thông tin quyền mới và lưu lại"
        : isEdit
            ? "Chỉnh sửa thông tin quyền và lưu lại"
            : "Xem chi tiết thông tin của quyền hiện có";

    const {
        data: createData,
        error: createError,
        sendRequest: createPermission,
    } = useAxiosMutation<CreatePermissionMutationResponseType, CreatePermissionPayload>({
        method: "POST",
        url: permissionApiUrl.createPermission,
        headers: { "Content-Type": "application/json" },
    });
    
    const {
        data: updateData,
        error: updateError,
        sendRequest: updatePermission,
    } = useAxiosMutation<CreatePermissionMutationResponseType, CreatePermissionPayload>({
        method: "PUT",
        url: id ? `${permissionApiUrl.updatePermission}/${id}` : "",
        headers: { "Content-Type": "application/json" },
    });

    const form = useForm<UpsertPermissionInput>({
        resolver: zodResolver(UpsertPermissionSchema),
        defaultValues: {
            name: "",
            description: "",
            resource_id: "",
            actions_ids: [],
        },
    });

    const onSubmit = (values: UpsertPermissionInput) => {
        console.log("Form submitted with values:", values);
        setOpenAlertDialog(true);
    };

    const onError = (errors: FieldErrors<UpsertPermissionInput>) => {
        console.warn("Validation errors:", errors);
    };

    const onSave = async () => {
        const values = form.getValues();
        const payload: CreatePermissionPayload = {
            name: values.name,
            description: values.description,
            resource_id: String(values.resource_id),
            actions_ids: values.actions_ids.map(id => String(id)),
        };


        if (isCreate) {
            await createPermission(payload);
            if (createError) {
                setToast({ title: "Lỗi hệ thống", message: "Không thể tạo quyền mới", variant: "error" });
                return;
            }
            if (createData?.is_success) {
                setToast({ title: "Thành công", message: "Quyền đã được tạo thành công", variant: "success" });
            }
        }

        if (isEdit && id) {
            await updatePermission(payload, id);
            if (updateError) {
                setToast({ title: "Lỗi hệ thống", message: "Không thể cập nhật quyền", variant: "error" });
                return;
            }
            if (updateData?.is_success) {
                setToast({ title: "Thành công", message: "Quyền đã được cập nhật thành công", variant: "success" });
            }
        }

        setOpenAlertDialog(false);
        setOpenDialog(false);
        form.reset();
        refetch?.();
    };

    return (
        <>
            <AppDialog
                trigger={trigger}
                dialogTitle={dialogTitle}
                dialogDescription={dialogDescription}
                open={openDialog}
                setOpen={setOpenDialog}
                onSubmit={() => form.handleSubmit(onSubmit, onError)()}
                submitButtonText={isDisabled ? null : "Lưu"}
            >
                <Form {...form}>
                    <UpsertPermissionForm form={form} isDisabled={isDisabled} />
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
};
