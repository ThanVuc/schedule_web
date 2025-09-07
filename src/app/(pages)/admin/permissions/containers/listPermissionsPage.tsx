import { AppAlertDialog, AppPagination, AppSearch, H2, Muted } from "@/components/common";
import { Statistic } from "../../_components/statistic";
import { EyeIcon, PencilIcon, RoleIcon, ShieldIcon, TrashIcon, UserIcon } from "@/components/icon";
import { CardItem, Cards } from "../../_components/cards";
import { ActionButton } from "../../_components";
import useToastState from "@/hooks/useToasts";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { useAxios, useAlertDialog, useAxiosMutation, useHasPermission } from "@/hooks";
import { permissionApiUrl } from "@/api";
import { PermissionResponse } from "../models/type/permission.type";
import { UpsertPermission } from "../containers/upsetPermissions";
import { DeletePermissionMutationResponseType } from "../models";
import { useModalParams } from "../hooks";
import APP_RESOURCES from "@/constant/resourceACL";
import { APP_ACTIONS } from "@/constant";


export const metadata = {
    title: "Quản lý quyền",
    description: "Trang quản lý quyền của hệ thống",
};

export const ListpermissionsPage = () => {
    const { setToast } = useToastState();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [permissionCardItems, setPermissionCardItems] = useState<CardItem[]>([]);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const { alertDialogProps, setAlertDialogProps } = useAlertDialog();
    const { mode, id } = useModalParams();

    const [canDeletePermission, canUpdatePermission, canCreatePermission,canReadAll, canReadOne,] = useHasPermission([
        { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.DELETE },
        { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.UPDATE },
        { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.CREATE },
        { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.READ_RESOURCES },
        { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.READ_ACTIONS },
       
    ]);


    const listParams = useMemo(() => {
        const entries = [...searchParams.entries()].filter(([key]) => key !== "mode" && key !== "id");
        return Object.fromEntries(entries);
    }, [searchParams]);


    const { data, error, refetch } = useAxios<PermissionResponse>({
        method: "GET",
        url: permissionApiUrl.getPermissions,
        params: { ...listParams },

    });

    useEffect(() => {
        if (data && data.items) {
            setPermissionCardItems(
                data.items.map(permission => ({
                    title: permission.perm_name,
                    description: permission.description || "Không có mô tả",
                    icon: <RoleIcon className="w-8 h-8" />,
                    isRoot: permission.is_root,
                    iconIsRoot: <ShieldIcon className="w-4 h-4 fill-blue-100" />,
                    actions: <div className="flex gap-2">{setActionCardOptions(permission.perm_id, permission.is_root)}</div>,
                }))
            );
        } else {
            setPermissionCardItems([]);
        }
    }, [data, canUpdatePermission, canDeletePermission, canCreatePermission, canReadAll, canReadOne]);

    const {
        sendRequest: deletePermission
    } = useAxiosMutation<DeletePermissionMutationResponseType>({
        method: "DELETE",
        url: `${permissionApiUrl.deletePermission}/${id}`,
        headers: { "Content-Type": "application/json" },
    });

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/admin/permissions?${params.toString()}`, { scroll: false });
    }

    const handleDeletePermission = async () => {
        if (mode !== "delete" || !id) return;

        const { data, error } = await deletePermission();
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể xóa quyền",
                variant: "error",
            });
            return;
        }
        if (data?.is_success) {
            setToast({
                title: "Xóa quyền thành công",
                message: "Quyền đã được xóa thành công",
                variant: "success",
            });
            setOpenAlertDialog(false);
            closeModal();
            refetch?.();
        }
    };



    useEffect(() => {
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể tải danh sách quyền",
                variant: "error",
            });
        }
    }, [error]);

    const statisticCardOptions = [
        {
            title: "Tổng số Quyền",
            value: data?.total_permissions || 0,
            icon: <RoleIcon className="w-8 h-8" />,
            description: "Tổng số quyền hiện có trong hệ thống"
        },
        {
            title: "Quyền gốc",
            value: data?.root || 0,
            icon: <ShieldIcon className="w-8 h-8 text-blue-700" />,
            description: "Quyền không thể chỉnh sửa"
        },
        {
            title: "Quyền bình thường",
            value: data?.non_root || 0,
            icon: <UserIcon className="w-8 h-8" />,
            description: "Quyền có thể chỉnh sửa và xóa",
        }
    ]

    const handlePageQueryToModal = (mode: string, id?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", mode);
        if (id) {
            params.set("id", id);
        } else {
            params.delete("id");
        }

        router.push(`/admin/permissions?${params.toString()}`);

    }


    useEffect(() => {
        if (mode === "delete") {
            setAlertDialogProps({
                title: "Xác nhận xóa quyền",
                description: "Bạn có chắc chắn muốn xóa quyền này?",
                submitText: "Xóa",
                onSubmit: handleDeletePermission,
                open: true,
                setOpen: setOpenAlertDialog,
            });
            setOpenAlertDialog(true);
        }

    }, [mode, id]);

    const setActionCardOptions = (id: string, isRoot?: boolean) => [
       canReadOne && (
         <ActionButton
            key="view-trigger"
            variant="outline"
            buttonText="Xem"
            onClick={() => handlePageQueryToModal("view", id)}
            icon={<EyeIcon className="w-4 h-4" />}
        />
       ),
        canUpdatePermission && (
            <ActionButton
                key="edit"
                variant="outline"
                buttonText="Chỉnh sửa"
                icon={<PencilIcon className="w-4 h-4" />}
                onClick={() => handlePageQueryToModal("edit", id)}
            />
        ),
        canDeletePermission && (
            <ActionButton
                key="delete"
                variant="destructive"
                buttonText="Xóa"
                icon={<TrashIcon className="w-4 h-4" />}
                onClick={() => {
                    if (isRoot) {
                        setToast({
                            title: "Xóa quyền",
                            message: "Bạn không được xóa quyền này",
                            variant: "warning",
                        })
                        return;
                    }
                    handlePageQueryToModal("delete", id)
                }}
            />
        )

    ]

    return (
        <>
            <AppAlertDialog
                title={alertDialogProps.title || "Xác nhận xóa quyền"}
                description={alertDialogProps.description || "Bạn có chắc chắn muốn xóa quyền này?"}
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                onClose={closeModal}
                submitText={alertDialogProps.submitText || "Xóa"}
                onSubmit={() => alertDialogProps.onSubmit?.()}
            />
            <div className="p-2 flex flex-col gap-4">
                <div className="header">
                    <div className="title">
                        <H2>Quản lý quyền</H2>
                        <Muted>Danh sách quyền hiện có trong hệ thống</Muted>
                    </div>
                </div>
                <Statistic statisticOptions={statisticCardOptions} />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <AppSearch
                        key="search-role"
                        placeholder="Tìm kiếm quyền..."
                        className="w-full sm:w-1/3"
                    />
                    {canCreatePermission && (
                        <Button
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 cursor-pointer"
                            onClick={() => handlePageQueryToModal("create")}
                        >
                            Tạo quyền mới
                        </Button>
                    )}
                </div>
                {canReadAll && (
                    <div className="body">
                        <Cards cards={permissionCardItems} />
                    </div>
                )}

                <UpsertPermission
                    refetch={refetch}
                />
                {
                    permissionCardItems.length !== 0 && (
                        <div>
                            <AppPagination
                                page={data?.page || 1}
                                total_pages={data?.total_pages || 1}
                                has_next={data?.has_next || false}
                                has_prev={data?.has_prev || false}
                                size={data?.page_size || 10}
                            />
                        </div>
                    )
                }
            </div>
        </>
    )
}
