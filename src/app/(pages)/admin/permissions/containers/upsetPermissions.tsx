"use client";

import React, { useEffect, useState } from "react";
import { AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { CreatePermissionMutationResponseType, UpsertPermissionSchema, PermissionModel } from "../models";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui";
import { useAxiosMutation, useConfirmDialog, useAxios } from "@/hooks";
import { permissionApiUrl } from "@/api";
import { UpsertPermissionForm } from "../components";
import { useModalParams } from "../hooks";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";


export interface AddPermissionProps {
    refetch?: () => void;
}

const buttonProps = {
    create: {
        title: "Thêm Quyền Mới",
        description: "Nhập thông tin quyền mới và lưu lại",
        submitButtonText: "Lưu",
        cancelButtonText: "Hủy Bỏ",
    },
    edit: {
        title: "Chỉnh Sửa Quyền",
        description: "Cập nhật thông tin quyền",
        submitButtonText: "Cập Nhật",
        cancelButtonText: "Hủy Bỏ",
    },
    view: {
        title: "Xem Quyền",
        description: "Thông tin chi tiết về quyền",
        submitButtonText: null,
        cancelButtonText: "Đóng",
    },
};

export const UpsertPermission = ({
    refetch,
}: AddPermissionProps) => {
    const { setToast } = useToastState();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mode, id } = useModalParams();
    const openDialog = mode === "create" || mode === "edit" || mode === "view";
    const isDisabled = mode === "view";
    const { confirm, dialog } = useConfirmDialog();

    const buttonData = buttonProps[mode as keyof typeof buttonProps] ?? buttonProps.create;

    const {
        sendRequest: createPermission,
    } = useAxiosMutation<CreatePermissionMutationResponseType, z.infer<typeof UpsertPermissionSchema>>({
        method: "POST",
        url: permissionApiUrl.createPermission,
        headers: { "Content-Type": "application/json" },
    });

    const {
        sendRequest: updatePermission,
    } = useAxiosMutation<CreatePermissionMutationResponseType, z.infer<typeof UpsertPermissionSchema>>({
        method: "PUT",
        url: `${permissionApiUrl.updatePermission}/${id}`,
        headers: { "Content-Type": "application/json" },
    });

    const {
        data: permissionData,
    } = useAxios<PermissionModel>({
        method: "GET",
        url: `${permissionApiUrl.getPermissionById}/${id}`,
        headers: { "Content-Type": "application/json" },
    });



    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/admin/permissions?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }

    const form = useForm<z.infer<typeof UpsertPermissionSchema>>({
        resolver: zodResolver(UpsertPermissionSchema),
        defaultValues: {
            name: "",
            description: "",
            resource_id: "",
            actions_ids: [],
        },
    });

    useEffect(() => {
        if (permissionData) {
            const formattedData = {
                name: permissionData.perm_name || "",
                description: permissionData.description || "",
                resource_id: permissionData.resource?.id || "",
                actions_ids: permissionData.actions.map(action => action.id) || [],
            };
            form.reset(formattedData);
            setOldUpdateType({
                resourceID: permissionData.resource?.id || "",
                actions: permissionData.actions.map(action => action.id) || [],
            });
        }
    }, [permissionData]);


    interface UpdateType {
        resourceID: string;
        actions: string[];
    }

    const [oldUpdateType, setOldUpdateType] = React.useState<UpdateType | null>(null);
    const [currentResourceActionIds, setCurrentResourceActionIds] = useState<string[]>([]);

    const compareUpdateType = (
        values: z.infer<typeof UpsertPermissionSchema>,
        currentResourceActionIds: string[]
    ) => {
        if (!oldUpdateType) return values;

        const filteredActions = values.actions_ids.filter(id =>
            currentResourceActionIds.includes(id)
        );
        return {
            ...values,
            actions_ids: filteredActions,
        };


    };



    const onSubmit = async (values: z.infer<typeof UpsertPermissionSchema>) => {
        if (isDisabled) return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;

        if (mode === "create") {


            const { data, error } = await createPermission(values);
            if (error) {
                setToast({
                    title: "Lỗi hệ thống",
                    message: "Không thể thêm quyền mới",
                    variant: "error",
                    closeable: false,
                });
                return;
            }

            if (data?.is_success) {
                closeModal();
                form.reset();
                setToast({
                    title: "Thành công",
                    message: "Quyền đã được thêm thành công",
                    variant: "success",
                    closeable: true,
                });
                if (refetch) {
                    refetch();
                }
            };
        }

        if (mode === "edit" && permissionData) {
            const updatedValues = compareUpdateType(values, currentResourceActionIds);
            const changedResource = values.resource_id !== oldUpdateType?.resourceID;
            if (!updatedValues) {
                setToast({
                    title: "Không có thay đổi",
                    message: "Không có thay đổi nào được thực hiện",
                    // variant: "info",
                    closeable: true,
                });
                return;
            }

            const { data, error } = await updatePermission(updatedValues);
            if (error) {
                setToast({
                    title: "Lỗi hệ thống",
                    message: "Không thể cập nhật quyền",
                    variant: "error",
                    closeable: false,
                });
                return;
            }

            if (data?.is_success) {
                if (changedResource) {
                    form.setValue("actions_ids", []);
                    setOldUpdateType({
                        resourceID: values.resource_id,
                        actions: [],
                    });
                }

                setToast({
                    title: "Thành công",
                    message: `Đã cập nhật quyền ${values.name} thành công`,
                    variant: "success",
                    closeable: true,
                });
                if (refetch) refetch();
                closeModal();
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
                    form.handleSubmit(onSubmit)()
                }}
                submitButtonText={isDisabled ? null : buttonData.submitButtonText}
                cancelButtonText={buttonData.cancelButtonText}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <UpsertPermissionForm form={form} isDisabled={isDisabled}
                            onActionsLoaded={setCurrentResourceActionIds}
                        />
                    </form>
                </Form>
            </AppDialog>
            {dialog}
        </>
    );
}
