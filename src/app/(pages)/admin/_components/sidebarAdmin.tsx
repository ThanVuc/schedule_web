"use client";
import { RoleIcon, CalendarIcon, AssignmentIcon, AdminIcon, ReturnUpBackToHomeIcon } from "@/components/icon";

import AppSideBar from "@/components/common/sidebar";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
const SidebarAdmin = ({ children }: { children: ReactNode }) => {
    const menuItems = useMemo(() => [
        {
            title: "Trang chủ",
            url: "/",
            icon: ReturnUpBackToHomeIcon,
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
    ], []);
    const pathname = usePathname();
    const getName = useMemo(() => {
        if (pathname.startsWith("/admin/users")) return "Danh sách người dùng";
        if (pathname.startsWith("/admin/roles")) return "Danh sách vai trò";
        if (pathname.startsWith("/admin/permissions")) return "Quyền hạn";
        return "";
    }, [pathname]);
    const headerurl = "/admin/users"
    return (<>
        <AppSideBar headerurl={headerurl} currentPage={getName} AppSidebar={menuItems} title="Quản Trị viên" headerTitle="Quản Trị viên" icon={AdminIcon}>
            {children}
        </AppSideBar>
    </>);
}

export default SidebarAdmin;