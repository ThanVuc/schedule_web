import React from "react";
import { Cards } from "../../../../../components/common/cards";
import { UserShieldIcon, EyeIcon, TrashIcon, BanIcon, PencilIcon } from "@/components/icon"





const data = [
    {
        icon: <span>🔑</span>,
        title: "Quyền 1",
        description: "Quyền quản trị toàn hệ thống",
        isRoot: true,
        iconIsRoot: <UserShieldIcon className="w-4 h-4" />,
        actions: (
            <>
                <button className="w-28 border text-xs px-4 py-1 rounded-md text-gray-800 flex items-center justify-center gap-1">
                    <EyeIcon className="w-4 h-4" /> Chi tiết
                </button>
                <button className="w-28 bg-blue-600 text-white text-xs px-4 py-1 rounded-md flex items-center justify-center gap-1">
                    <PencilIcon className="w-4 h-4" /> Chỉnh sửa
                </button>
                <button className="w-28 bg-yellow-400 text-white text-xs px-4 py-1 rounded-md flex items-center justify-center gap-1">
                    <BanIcon className="w-4 h-4" /> Vô hiệu hóa
                </button>
                <button className="w-28 bg-red-600 text-white text-xs px-4  py-1 rounded-md flex items-center justify-center gap-1">
                    <TrashIcon className="w-4 h-4" /> Xóa
                </button>
            </>
        ),
    },
    {
        icon: <span>🔒</span>,
        title: "Quyền 2",
        description: "Chỉ xem dữ liệu",
        isRoot: false,
      
        actions: (
            <>
                <button className="w-28 border text-xs px-4 py-1 rounded-md text-gray-800 flex items-center justify-center gap-1">
                    <EyeIcon className="w-4 h-4" /> Chi tiết
                </button>
                <button className="w-28 bg-blue-600 text-white text-xs px-4 py-1 rounded-md flex items-center justify-center gap-1">
                    <PencilIcon className="w-4 h-4" /> Chỉnh sửa
                </button>
                <button className="w-28 bg-yellow-400 text-white text-xs px-4 py-1 rounded-md flex items-center justify-center gap-1">
                    <BanIcon className="w-4 h-4" /> Vô hiệu hóa
                </button>
                <button className="w-28 bg-red-600 text-white text-xs px-4  py-1 rounded-md flex items-center justify-center gap-1">
                    <TrashIcon className="w-4 h-4" /> Xóa
                </button>
            </>
        ),
    },
    {
        icon: <span>⚙️</span>,
        title: "Quyền 3",
        description: "Quyền cấu hình",
        isRoot: true,
        iconIsRoot: <UserShieldIcon className="w-4 h-4" />,
        actions: (
            <>
                <button className="w-28 border text-xs px-4 py-1 rounded-md text-gray-800 flex items-center justify-center gap-1">
                    <EyeIcon className="w-4 h-4" /> Chi tiết
                </button>
                <button className="w-28 bg-blue-600 text-white text-xs px-4 py-1 rounded-md flex items-center justify-center gap-1">
                    <PencilIcon className="w-4 h-4" /> Chỉnh sửa
                </button>
                <button className="w-28 bg-yellow-400 text-white text-xs px-4 py-1 rounded-md flex items-center justify-center gap-1">
                    <BanIcon className="w-4 h-4" /> Vô hiệu hóa
                </button>
                <button className="w-28 bg-red-600 text-white text-xs px-4  py-1 rounded-md flex items-center justify-center gap-1">
                    <TrashIcon className="w-4 h-4" /> Xóa
                </button>
            </>
        ),
    },
];
export default function Page() {

    return (
        <div className="w-full p-4">
            <Cards cards={data} />
        </div>
    );
}
