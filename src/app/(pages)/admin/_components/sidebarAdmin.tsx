"use client";
import { RoleIcon, ReturnUpBackToHome, CalendarIcon, AssignmentIcon, AdminIcon } from "@/components/icon";

import AppSideBar, { SidebarItem } from "@/components/common/sidebar";
import { ReactNode } from "react";
import { forbidden, usePathname } from "next/navigation";
import { useHasPermission } from "@/hooks";
import APP_RESOURCES from "@/constant/resourceACL";
import { APP_ACTIONS } from "@/constant";
const SidebarAdmin = ({ children }: { children: ReactNode }) => {
    const [hasAccessUser, hasAccessRole, hasAccessPermission] = useHasPermission([
        { resource: APP_RESOURCES.ADMIN_USER, action: APP_ACTIONS.READ_ALL },
        { resource: APP_RESOURCES.ROLE, action: APP_ACTIONS.READ_ALL },
        { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.READ_ALL },
    ]);
    const pathname = usePathname();
    const hasAdminAccess = hasAccessUser || hasAccessRole || hasAccessPermission;
    if (!hasAdminAccess) return forbidden();
    
    const menuItems = [
        {
            title: "Trang chủ",
            url: "/",
            icon: ReturnUpBackToHome,
        },
        hasAccessUser &&
        {
            title: "Quản Lý Người dùng",
            url: "/admin/users",
            icon: CalendarIcon,
        },
        hasAccessRole &&
        {
            title: "Quản Lý Vai trò",
            url: "/admin/roles",
            icon: RoleIcon,
        },
        hasAccessPermission &&
        {
            title: "Quản Lý Quyền hạn",
            url: "/admin/permissions",
            icon: AssignmentIcon,
        },
    ].filter(Boolean) as SidebarItem[];
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