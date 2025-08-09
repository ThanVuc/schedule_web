import { AppAlertDialog, AppPagination, AppSearch, H2, Muted } from "@/components/common";
import { Statistic } from "../../_components/statistic";
import { EyeIcon, PencilIcon, RoleIcon, ShieldIcon, TrashIcon, UserIcon } from "@/components/icon";
import { CardItem, Cards } from "../../_components/cards";
import { ActionButton } from "../../_components";
import useToastState from "@/hooks/useToasts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { UpsertRole } from "./upsertRole";
import { useAxios, useAlertDialog } from "@/hooks";
import { roleApiUrl } from "@/api";
import { RolesResponse } from "../models";


export const metadata = {
    title: "Quản lý vai trò",
    description: "Trang quản lý vai trò của hệ thống",
};


export const ListRolePage = () => {
    const { setToast } = useToastState();
    const searchParams = useSearchParams();
    const router = useRouter();
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

    useEffect(() => {
        if (data && data.items) {
            SetRoleCardItems(
                data.items.map(role => ({
                    title: role.name,
                    description: role.description || "Không có mô tả",
                    icon: role.is_root ? <RoleIcon className="w-8 h-8" /> : <UserIcon className="w-8 h-8 fill-amber-100" />,
                    isRoot: role.is_root,
                    iconIsRoot: <ShieldIcon className="w-4 h-4 fill-blue-100" />,
                    actions: <div className="flex gap-2">{setActionCardOptions(role.role_id)}</div>,
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

    const handlePageQueryToModal = (mode: string, id?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", mode);
        if (id) {
            params.set("id", id)
        } else {
            params.delete("id");
        }

        router.push(`/admin/roles?${params.toString()}`, {scroll: false});
    }

    const setActionCardOptions = (id: string) => [
        <ActionButton
            key="view-trigger"
            variant="outline"
            buttonText="Xem"
            icon={<EyeIcon className="w-4 h-4" />}
            onClick={() => handlePageQueryToModal("view", id)}
        />,
        <ActionButton
            key="edit"
            variant="outline"
            buttonText="Chỉnh sửa"
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={() => handlePageQueryToModal("edit", id)}
        />,
        <ActionButton
            key="delete"
            variant="destructive"
            buttonText="Xóa"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => {
                setAlertDialogProps({
                    title: "Xác nhận xóa vai trò",
                    description: "Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.",
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
        />
    ]

    return (
        <>
            <AppAlertDialog
                title={alertDialogProps.title || "Xác nhận xóa vai trò"}
                description={alertDialogProps.description || "Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác."}
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                submitText={alertDialogProps.submitText || "Xóa"}
                onSubmit={() => alertDialogProps.onSubmit?.()}
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
                    <Button
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 cursor-pointer"
                        onClick={() => handlePageQueryToModal("create")}
                    >Thêm Vai Trò</Button>
                </div>

                <div className="body">
                    <Cards cards={roleCardItems} />
                </div>

                <UpsertRole
                    refetch={refetch}
                />

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