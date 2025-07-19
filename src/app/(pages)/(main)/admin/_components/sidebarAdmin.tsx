"use client";
import { RoleIcon, ReturnUpBackToHome, CalendarIcon, AssignmentIcon, AdminIcon } from "@/components/icon";
import AppSideBar from "@/components/common/sidebar";
import { ReactNode } from "react";
const SidebarAdmin = ({ children }: { children: ReactNode }) => {
    const menuItems = [
        {
            title: "Trang chủ",
            url: "/",
            icon: ReturnUpBackToHome,
        },
        {
            title: "Vai trò",
            url: "/admin/roles",
            icon: RoleIcon,
        },
        {
            title: "Danh sách người dùng",
            url: "/admin/users",
            icon: CalendarIcon,
        },
        {
            title: "Quyền hạn",
            url: "/admin/permissions",
            icon: AssignmentIcon,
        },
    ];
    return (<>
        <AppSideBar AppSidebar={menuItems} title="Quản Trị viên" headerTitle="Quản Trị viên" icon={AdminIcon}>
            {children}
        </AppSideBar>
    </>);
}

export default SidebarAdmin;