import { AppAlertDialog, AppPagination, AppSearch, H2, Muted } from "@/components/common";
import { Statistic } from "../../_components/statistic";
import { EyeIcon, PencilIcon, RoleIcon, ShieldIcon, TrashIcon, UserIcon } from "@/components/icon";
import { CardItem, Cards } from "../../_components/cards";
import { ActionButton } from "../../_components";
import useToastState from "@/hooks/useToasts";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { useAxios, useAlertDialog } from "@/hooks";
import { permissionApiUrl } from "@/api";
import { PermissionResponse } from "../models/type/permission.type";
import { UpsertPermission } from "../containers/upsetPermissions";


export const metadata = {
    title: "Quản lý quyền",
    description: "Trang quản lý quyền của hệ thống",
};

export const ListpermissionsPage = () => {
    const { setToast } = useToastState();
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const [permissionCardItems, setPermissionCardItems] = useState<CardItem[]>([]);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const params = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
    const { alertDialogProps, setAlertDialogProps } = useAlertDialog();

    const { data, error, refetch } = useAxios<PermissionResponse>({
        method: "GET",
        url: permissionApiUrl.getPermissions,
        params: { ...params, page: currentPage },

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
                    actions: <div className="flex gap-2">{setActionCardOptions(permission.perm_id)}</div>,
                }))
            );
        } else {
            setPermissionCardItems([]);
        }
    }, [data]);

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

    const setActionCardOptions = (id: string) => [
        <UpsertPermission
            key="view"
            trigger={
                <ActionButton key="view-trigger" variant="outline" buttonText="Xem" icon={<EyeIcon className="w-4 h-4" />} />
            }
            action="view"
            id={id}
        />,
        <UpsertPermission
            key="edit"
            trigger={
                <ActionButton key="edit-trigger" variant="outline" buttonText="Chỉnh sửa" icon={<PencilIcon className="w-4 h-4" />} />
            }
            action="upsert"
            id={id}
        />,
        <ActionButton
            key="delete"
            variant="destructive"
            buttonText="Xóa"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => {
                setAlertDialogProps({
                    title: "Xác nhận xóa",
                    description: "Bạn có chắc chắn muốn xóa quyền này?",
                    submitText: "Xóa",
                    onSubmit: () => {
                        setToast({
                            title: "Xóa vai trò",
                            message: "Đang xóa vai trò, vui lòng đợi...",
                            variant: "default",
                        });
                    },
                    open: true,
                    setOpen: setOpenAlertDialog,
                });
                setOpenAlertDialog(true);
            }}

        />,
    ]

    return (
        <>
            <AppAlertDialog
                title={alertDialogProps.title || "Xác nhận xóa quyền"}
                description={alertDialogProps.description || "Bạn có chắc chắn muốn xóa quyền này?"}
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                onSubmit={() => {
                    setToast({
                        title: "Xóa quyền",
                        message: "Đang xóa quyền, vui lòng đợi...",
                        variant: "default",
                    });
                    setOpenAlertDialog(false);
                }}
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
                    <UpsertPermission
                        trigger={
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 cursor-pointer">Thêm quyền</Button>
                        }
                        action="upsert"
                        refetch={() => {
                            if (refetch) {
                                refetch();
                            }
                        }}
                    />
                </div>

                <div className="body">
                    <Cards cards={permissionCardItems} />
                </div>
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
