"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";
export interface SidebarItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
}
export interface SidebarProp {
    AppSidebar: SidebarItem[];
    title: string;
    headerTitle: string;
    headerUrl: string;
    icon: React.ComponentType<{ className?: string }>;
    currentPage: string;
    sideBarClassName?: string;
}
const AppSideBar = ({ AppSidebar, title, headerTitle, children, icon, currentPage, headerUrl,sideBarClassName }: SidebarProp & { children: ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <SidebarProvider>
            <Sidebar className="min-h-screen w-64 border-r bg-white shadow-lg">
                <SidebarContent className= {`flex-1 p-4 ${sideBarClassName}`}>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-md font-bold uppercase tracking-wider px-2 mb-3">
                            {React.createElement(icon, { className: "w-5 h-5 mr-2 inline" })}
                            {title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {AppSidebar.map((item) => {
                                    const isActive = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <button
                                                    onClick={() => router.push(item.url)}
                                                    className={`flex items-center w-full gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 group
                                                                ${isActive
                                                            ? "bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-500"
                                                            : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                                                        }`}
                                                >
                                                    <item.icon
                                                        className={`w-5 h-5 transition-all duration-200 ${isActive
                                                            ? "text-blue-600"
                                                            : "text-gray-400 group-hover:text-blue-500"
                                                            }`}
                                                    />
                                                    <span>{item.title}</span>
                                                </button>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <div className="flex h-16 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-4 mx-2" />
                    {currentPage && (
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage
                                        className="text-sm text-gray-600 flex"
                                        onClick={() => router.push(headerUrl)}
                                    >
                                        {headerTitle}
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
                </div>
                <main className="p-4">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
};
export default AppSideBar;
