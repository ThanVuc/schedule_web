"use client";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideBar from "../../../../components/common/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { RoleIcon, ReturnUpBackToHome, CalendarIcon, AssignmentIcon } from "@/components/icon";

import { ReactNode } from "react";
const AdminLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    const getName = () => {
        if (pathname.startsWith("/admin/users")) return "Danh sách người dùng";
        if (pathname.startsWith("/admin/roles")) return "Danh sách vai trò";
        if (pathname.startsWith("/admin/permissions")) return "Quyền hạn";
        return "";
    };
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

    const currentPage = getName();
    const router = useRouter();
    return (
        <div className="w-full min-h-screen bg-gray-50">
            <SidebarProvider>
                <SideBar array={menuItems} />
                <SidebarInset>
                    <header className="flex h-16 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-4 mx-2" />
                        {currentPage && (
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage
                                            className="text-sm text-gray-600 flex"
                                            onClick={() => router.push("/admin/users")}
                                        >
                                            Quản trị viên
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="font-semibold text-primary">
                                            {currentPage}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        )}
                    </header>
                    <main className="p-4">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default AdminLayout;
