"use client";
import { ReturnUpBackToHome, AssignmentIcon, TargetIcon, MarketAnalysisIcon, Schedulr } from "@/components/icon";

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
            title: "Xem thông tin nhãn",
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
        if (pathname.startsWith("/schedule/daily")) return "Lịch Trình Hằng Ngày";
        if (pathname.startsWith("/schedule/goal")) return "Quản lý mục tiêu";
        if (pathname.startsWith("/schedule/labels")) return "Xem thông tin nhãn";
        if (pathname.startsWith("/schedule/analysis")) return "Phân Tích, Báo Cáo, Thống Kê dựa trên AI";
        return "";
    };
    const headerUrl = "/schedule/daily";
    const currentPage = getName();
    return (<>
        <AppSideBar headerUrl={headerUrl} currentPage={currentPage} AppSidebar={menuItems} title="Schedulr" headerTitle="Quản lý lịch trình" icon={Schedulr}>
            {children}
        </AppSideBar>
    </>);
}

export default SidebarSchedule;

