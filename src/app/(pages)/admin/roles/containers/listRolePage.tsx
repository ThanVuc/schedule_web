import { AppAlertDialog, AppPagination, AppSearch, H2, Muted } from "@/components/common";
import { Statistic } from "../../_components/statistic";
import { EyeIcon, LockIcon, PencilIcon, RoleIcon, ShieldIcon, TrashIcon, UnLockIcon, UserIcon } from "@/components/icon";
import { CardItem, Cards } from "../../_components/cards";
import { ActionButton } from "../../_components";
import useToastState from "@/hooks/useToasts";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { UpsertRole } from "./upsertRole";
import { useAxios, useAlertDialog, useAxiosWaitCall, useAxiosMutation,} from "@/hooks";
import { roleApiUrl } from "@/api";
import { DeleteRoleMutationResponseType, DisableOrEnableRoleMutationResponseType, RoleModel, RolesResponse } from "../models";
export const metadata = {
    title: "Quản lý vai trò",
    description: "Trang quản lý vai trò của hệ thống",
};
export const ListRolePage = () => {
    const { setToast } = useToastState();
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const [roleCardItems, SetRoleCardItems] = useState<CardItem[]>([]);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const params = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
    const { alertDialogProps, setAlertDialogProps } = useAlertDialog();

    const { data, error, refetch } = useAxios<RolesResponse>({
        method: "GET",
        url: roleApiUrl.getRoles,
        params: { ...params, page: currentPage },
    });
    const { sendRequest, error: deleteError } = useAxiosMutation<DeleteRoleMutationResponseType>({
        method: "DELETE",
        url: roleApiUrl.deleteRole,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const { sendRequest: disableOrEnableRequest, error: disableOrEnableError } = useAxiosMutation<DisableOrEnableRoleMutationResponseType>({
        method: "PUT",
        url: roleApiUrl.disableOrEnableRole,
        headers: {
            "Content-Type": "application/json"
        }
    });
    useEffect(() => {
        if (data && data.items) {
            SetRoleCardItems(
                data.items.map(role => ({
                    title: role.name,
                    description: role.description || "Không có mô tả",
                    icon: role.is_root ? <RoleIcon className="w-8 h-8" /> : <UserIcon className="w-8 h-8 fill-amber-100" />,
                    isRoot: role.is_root,
                    iconIsRoot: <ShieldIcon className="w-4 h-4 fill-blue-100" />,
                    actions: <div className="flex gap-2">{setActionCardOptions(role)}</div>,
                }))
            );
        } else {
            SetRoleCardItems([]);
        }
    }, [data]);

 

    useEffect(() => {
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể tải danh sách vai trò",
                variant: "error",
            });
        }
    }, [error]);
    useEffect(() => {
        if (deleteError) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể xóa vai trò",
                variant: "error",
            });
        }
    }, [deleteError]);

    const statisticCardOptions = [
        {
            title: "Tổng số vai trò",
            value: data?.total_roles || 0,
            icon: <RoleIcon className="w-8 h-8" />,
            description: "Tổng số vai trò hiện có trong hệ thống"
        },
        {
            title: "Vai trò gốc",
            value: data?.root || 0,
            icon: <ShieldIcon className="w-8 h-8 text-blue-700" />,
            description: "Vai trò không thể chỉnh sửa"
        },
        {
            title: "Vai trò bình thường",
            value: data?.non_root || 0,
            icon: <UserIcon className="w-8 h-8" />,
            description: "Vai trò có thể chỉnh sửa và xóa",
        }
    ]
    const setActionCardOptions = (role: RoleModel) => {
    const { role_id, is_active } = role;
    return [
        <UpsertRole
            key="view"
            trigger={
                <ActionButton key="view-trigger" variant="outline" buttonText="Xem" icon={<EyeIcon className="w-4 h-4" />} />
            }
            action="view"
            id={role_id}
            dialogTitle="Xem Vai Trò"
            dialogDescription="Thông tin chi tiết về vai trò này"
        />,
        <UpsertRole
            key="edit"
            trigger={
                <ActionButton key="edit" variant="outline" buttonText="Chỉnh sửa" icon={<PencilIcon className="w-4 h-4" />} />
            }
            action="update"
            id={role_id}
            refetch={refetch}
            dialogTitle="Chỉnh sửa Vai Trò"
            dialogDescription="Chỉnh sửa thông tin vai trò"
        />,
        is_active ? (
            <ActionButton
                key="disable"
                buttonText="Vô hiệu hoá"
                className="bg-yellow-600 hover:bg-yellow-500 "
                icon={<UnLockIcon className="w-4 h-4" />}
                onClick={() => {
                    setAlertDialogProps({
                        title: "Xác nhận Vô hiệu hoá vai trò",
                        description: "Bạn có chắc chắn muốn Vô hiệu hoá vai trò này? Hành động này không thể hoàn tác.",
                        submitText: "Vô hiệu hoá",
                        onSubmit: async () => {
                            await disableOrEnableRequest({ is_active: false }, `${role_id}/disable-or-enable`);
                            setToast({
                                title: "Vô hiệu hoá vai trò",
                                message: "Đang Vô hiệu hoá vai trò, vui lòng đợi...",
                                variant: "default",
                            });
                            refetch?.();
                        },
                        open: true,
                        setOpen: setOpenAlertDialog,
                    });
                    setOpenAlertDialog(true);
                }}
            />
        ) : (
            <ActionButton
                key="enable"
                buttonText="Kích hoạt"
                className="bg-green-600 hover:bg-green-500 text-white"
                icon={<LockIcon className="w-4 h-4" />}
                onClick={() => {
                    setAlertDialogProps({
                        title: "Xác nhận kích hoạt vai trò",
                        description: "Bạn có chắc chắn muốn kích hoạt vai trò này? Hành động này không thể hoàn tác.",
                        submitText: "Kích hoạt",
                        onSubmit: async () => {
                            await disableOrEnableRequest({ is_active: true }, `${role_id}/disable-or-enable`);
                            setToast({
                                title: "Kích hoạt vai trò",
                                message: "Đang kích hoạt vai trò, vui lòng đợi...",
                                variant: "default",
                            });
                            refetch?.();
                        },
                        open: true,
                        setOpen: setOpenAlertDialog,
                    });
                    setOpenAlertDialog(true);
                }}
            />
        ),
        <ActionButton
            key="delete"
            variant="destructive"
            buttonText="Xóa"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => {
                setAlertDialogProps({
                    title: `Xác nhận xóa vai trò "${role.name}"`,
                    description: "Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.",
                    submitText: "Xóa",
                    onSubmit: async () => {
                        await sendRequest(undefined, role_id);
                        setToast({
                            title: "Xóa vai trò",
                            message: "Đang xóa vai trò, vui lòng đợi...",
                            variant: "default",
                        });
                        refetch?.();
                    },
                    open: true,
                    setOpen: setOpenAlertDialog,
                });
                setOpenAlertDialog(true);
            }}
        />,
    ];
};

    return (
        <>
            <AppAlertDialog
                title={alertDialogProps.title || "Xác nhận xóa vai trò"}
                description={alertDialogProps.description || "Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác."}
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                submitText={alertDialogProps.submitText || "Xóa"}
                onSubmit={() => alertDialogProps.onSubmit?.()
                }
            />
            <div className="p-2 flex flex-col gap-4">
                <div className="header">
                    <div className="title">
                        <H2>Danh Sách Vai Trò</H2>
                        <Muted className="!text-base">Theo dõi và phân loại vai trò người dùng trong hệ thống</Muted>
                    </div>
                </div>
                <Statistic statisticOptions={statisticCardOptions} />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <AppSearch
                        key="search-role"
                        placeholder="Tìm kiếm vai trò..."
                        className="w-full sm:w-1/3"
                    />
                    <UpsertRole
                        dialogTitle="Thêm Vai Trò Mới"
                        dialogDescription="Nhập thông tin vai trò mới và lưu lại"
                        trigger={
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 cursor-pointer">Thêm Vai Trò</Button>
                        }
                        action="create"
                        refetch={() => {
                            if (refetch) {
                                refetch();
                            }
                        }}
                    />
                </div>
                <div className="body">
                    <Cards cards={roleCardItems} />
                </div>
                {
                    roleCardItems.length !== 0 && (
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
    );
}