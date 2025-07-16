import { H2, Muted } from "@/components/common";
import { Statistic } from "../../_components/statistic";
import { ShieldIcon, UserIcon } from "lucide-react";
import { RoleIcon } from "@/components/icon";


export const metadata = {
    title: "Quản lý vai trò",
    description: "Trang quản lý vai trò của hệ thống",
};

const cardOptions = [
    {
        title: "Tổng số vai trò",
        value: 133,
        icon: <RoleIcon className="w-8 h-8" />,
        description: "Tổng số vai trò hiện có trong hệ thống"
    },
    {
        title: "Vai trò gốc",
        value: 10,
        icon: <ShieldIcon className="w-8 h-8 fill-blue-100" />,
        description: "Vai trò không thể chỉnh sửa"
    },
    {
        title: "Vai trò bình thường",
        value: 123,
        icon: <UserIcon className="w-8 h-8 fill-amber-100" />,
        description: "Vai trò có thể chỉnh sửa và xóa",
    }
]

export const ListRolePage = () => {
    return (
        <>
            <div className="p-2 flex flex-col gap-4">
                <div className="header">
                    <div className="title">
                        <H2>Danh Sách Vai Trò</H2>
                        <Muted className="!text-base">Theo dõi và phân loại vai trò người dùng trong hệ thống</Muted>
                    </div>
                </div>
                <Statistic statisticOptions={cardOptions} />
                <div className="body">

                </div>
                <div>

                </div>
            </div>
        </>
    );
}