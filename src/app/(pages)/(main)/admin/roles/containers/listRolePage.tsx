import { AppAlertDialog, AppPagination, AppSearch, H2, Muted } from "@/components/common";
import { Statistic } from "../../_components/statistic";
import { EyeIcon, PencilIcon, RoleIcon, ShieldIcon, TrashIcon, UserIcon } from "@/components/icon";
import { CardItem, Cards } from "../../_components/cards";
import { ActionButton } from "../../_components";
import useToastState from "@/hooks/useToasts";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { UpsertRole } from "../containers/upsertRole";


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

    const statisticCardOptions = [
        {
            title: "Tổng số vai trò",
            value: 133,
            icon: <RoleIcon className="w-8 h-8" />,
            description: "Tổng số vai trò hiện có trong hệ thống"
        },
        {
            title: "Vai trò gốc",
            value: 10,
            icon: <ShieldIcon className="w-8 h-8 text-blue-700" />,
            description: "Vai trò không thể chỉnh sửa"
        },
        {
            title: "Vai trò bình thường",
            value: 123,
            icon: <UserIcon className="w-8 h-8" />,
            description: "Vai trò có thể chỉnh sửa và xóa",
        }
    ]

    useEffect(() => {
        SetRoleCardItems([
            {
                title: "Quản trị viên",
                description: "Vai trò quản lý toàn bộ hệ thống",
                icon: <RoleIcon className="w-8 h-8" />,
                isRoot: true,
                iconIsRoot: <ShieldIcon className="w-4 h-4 fill-blue-100" />,
                actions: (
                    <div className="flex gap-2">
                        {actionCardOptions}
                    </div>
                )
            },
            {
                icon: <UserIcon className="w-8 h-8 fill-amber-100" />,
                title: "Người dùng",
                description: "Vai trò có quyền truy cập và sử dụng các chức năng cơ bản",
                actions: (
                    <div className="flex gap-2">
                        {actionCardOptions}
                    </div>
                )
            }
        ]);
    }, [currentPage]);


    const actionCardOptions = [
        <UpsertRole
            key="view"
            trigger={
                <ActionButton key="view-trigger" variant="outline" buttonText="Xem" icon={<EyeIcon className="w-4 h-4" />} />
            }
            action="view"
        />,
        <UpsertRole
            key="edit"
            trigger={
                <ActionButton key="edit" variant="outline" buttonText="Chỉnh sửa" icon={<PencilIcon className="w-4 h-4" />} />
            }
            action="upsert"
        />,
        <ActionButton
            key="delete"
            variant="destructive"
            buttonText="Xóa"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => setOpenAlertDialog(true)}
        />
    ]


    return (
        <>
            <AppAlertDialog
                title="Xác nhận xóa vai trò"
                description="Bạn có chắc chắn muốn xóa vai trò này?"
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                submitText="Xóa"
                onSubmit={() => {
                    setOpenAlertDialog(false);
                    setToast({
                        title: "Xóa thành công",
                        message: "Vai trò đã được xóa thành công",
                        variant: "success"
                    });
                }}
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
                        trigger={
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 cursor-pointer">Thêm Vai Trò</Button>
                        }
                        action="upsert"
                    />
                </div>

                <div className="body">
                    <Cards cards={roleCardItems} />
                </div>
                {
                    roleCardItems.length !== 0 && (
                        <div>
                            <AppPagination
                                page={3}
                                total_pages={10}
                                has_next={true}
                                has_prev={false}
                            />
                        </div>
                    )
                }

            </div>
        </>
    );
}