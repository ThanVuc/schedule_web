"use client";
import { ReturnUpBackToHome, AssignmentIcon, AdminIcon, TargetIcon, GridIcon, MarketAnalysisIcon } from "@/components/icon";

import AppSideBar, { SidebarItem } from "@/components/common/sidebar";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LabelIcon } from "@/components/icon/label";

const SidebarSchedule = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();


    const menuItems = [
        {
            title: "Trang chủ",
            url: "/",
            icon: ReturnUpBackToHome,
        },
        {
            title: "Lịch Trình Hằng Ngày",
            url: "/schedule/daily",
            icon: AssignmentIcon,
        },
        {
            title: "Quản lý mục tiêu",
            url: "/schedule/goal",
            icon: TargetIcon,
        },
        {
            title: "Quản lý danh mục",
            url: "/schedule/categories",
            icon: GridIcon,
        },
        {
            title: "Quản lý nhãn",
            url: "/schedule/labels",
            icon: LabelIcon,
        },
        {
            title: "Phân Tích, Báo Cáo, Thống Kê dựa trên AI",
            url: "/schedule/analysis",
            icon: MarketAnalysisIcon,
        },


    ].filter(Boolean) as SidebarItem[];
    const getName = () => {
        if (pathname.startsWith("/schedule/analysis")) return "Danh sách người dùng";
        if (pathname.startsWith("/schedule/roles")) return "Danh sách vai trò";
        if (pathname.startsWith("/schedule/permissions")) return "Quyền hạn";
        if (pathname.startsWith("/schedule/categories")) return "Quản Lý danh mục";
        if (pathname.startsWith("/schedule/daily")) return "Quản Lý công việc";
        if (pathname.startsWith("/schedule/labels")) return "Quản Lý nhãn";
        if (pathname.startsWith("/schedule/goal")) return "Quản Lý mục tiêu";
        return "";
    };
    const headerUrl = "/schedule/daily";
    const currentPage = getName();
    return (<>
            <AppSideBar sideBarClassName="  bg-[#1E293B]/20" headerUrl={headerUrl} currentPage={currentPage} AppSidebar={menuItems} title="SCHEDULR" headerTitle="SCHEDULR" icon={AdminIcon}>
                {children}
            </AppSideBar>
    </>);
}

export default SidebarSchedule;