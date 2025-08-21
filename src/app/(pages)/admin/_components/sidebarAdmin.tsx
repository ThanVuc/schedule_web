"use client";
import { RoleIcon, ReturnUpBackToHome, CalendarIcon, AssignmentIcon, AdminIcon } from "@/components/icon";

import AppSideBar from "@/components/common/sidebar";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
const SidebarAdmin = ({ children }: { children: ReactNode }) => {
    const menuItems = [
        {
            title: "Trang chủ",
            url: "/",
            icon: ReturnUpBackToHome,
        },
                {
            title: "Quản Lý Người dùng",
            url: "/admin/users",
            icon: CalendarIcon,
        },
        {
            title: "Quản Lý Vai trò",
            url: "/admin/roles",
            icon: RoleIcon,
        },
        {
            title: "Quản Lý Quyền hạn",
            url: "/admin/permissions",
            icon: AssignmentIcon,
        },
    ];
    const pathname = usePathname();
    const getName = () => {
        if (pathname.startsWith("/admin/users")) return "Danh sách người dùng";
        if (pathname.startsWith("/admin/roles")) return "Danh sách vai trò";
        if (pathname.startsWith("/admin/permissions")) return "Quyền hạn";
        return "";
    };
    const headerurl = "/admin/users"
    const currentPage = getName();
    return (<>
        <AppSideBar headerurl={headerurl} currentPage={currentPage} AppSidebar={menuItems} title="Quản Trị viên" headerTitle="Quản Trị viên" icon={AdminIcon}>
            {children}
        </AppSideBar>
    </>);
}

export default SidebarAdmin;