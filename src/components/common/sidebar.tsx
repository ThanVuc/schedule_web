"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";
import img from "@/../public/assets/e145d5f684c1d0a465722a583e09904e.jpg";
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
import { cn } from "@/lib/utils";
import { AppHoverClickCard } from "./hoverClickCard";
import { Avatar, AvatarFallback, AvatarImage } from "../ui";
import { UserCardContent } from "@/app/(pages)/(main)/_components";
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
    className?: string;
    variant?: "light" | "dark";
    image?: Blob;
}
const AppSideBar = ({ AppSidebar, title, headerTitle, children, icon, currentPage, headerUrl, className, variant = "dark", image }: SidebarProp & { children: ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const variantStyle = variant === "light" ? {
        titleStyle: "text-xl mb-2",
        bgColor: "bg-white",
        activeSelector: "!bg-blue-50 !text-blue-600 !font-semibold !border-l-4 !border-blue-500",
        hoverSelector: "text-gray-700 hover:!bg-gray-100 hover:!text-blue-500",
        textColor: "text-gray-700",
        borderColor: "border-gray-200",
        breadcrumbText: "text-sm text-gray-600 flex",
        breadcrumbCurrent: "font-semibold text-primary",
    } : {
        titleStyle: "text-2xl md:text-3xl !text-[#8EC5FF] mb-5",
        bgColor: "bg-background",
        activeSelector: "text-[#8EC5FF] !bg-[#1E293B] !font-semibold !border-l-4 !border-[#8EC5FF]",
        hoverSelector: "text-[#8EC5FF]/70 hover:!text-[#8EC5FF]",
        textColor: "text-gray-200",
        borderColor: "border-[#1E293B]",
        breadcrumbText: "text-sm text-gray-200 flex font-semibold",
        breadcrumbCurrent: "font-semibold text-primary",
        iconSize: "!w-7 !h-7",
    };

    return (
        <SidebarProvider>
            <Sidebar className={`min-h-screen w-64 border-r ${variantStyle.titleStyle} ${variantStyle.bgColor} shadow-lg ${className}`}>
                <SidebarContent className={`flex-1 p-4 ${variantStyle.bgColor} ${variantStyle.textColor} ${variantStyle.borderColor} border-r`}>
                    <SidebarGroup>
                        <SidebarGroupLabel
                            className={cn(
                                `sm:inline ${variantStyle.titleStyle} font-semibold cursor-pointer`,
                                variantStyle.textColor
                            )}
                            onClick={() => router.push("/")}>
                            {React.createElement(icon, { className: `${variantStyle.iconSize} mr-2 inline` })}
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
                                                    className={cn(
                                                        "flex items-center w-full gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 group",
                                                        isActive ? variantStyle.activeSelector : variantStyle.hoverSelector
                                                    )}
                                                >
                                                    <item.icon />
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
                <div className={`flex items-center justify-between border-b pr-5 ${variantStyle.borderColor} ${variantStyle.bgColor}`}>
                    <div className="flex h-16 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-4 mx-2" />
                        {currentPage && (
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage
                                            className={`cursor-pointer ${variantStyle.breadcrumbText}`}
                                            onClick={() => router.push(headerUrl)}
                                        >
                                            {headerTitle}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className={`hidden md:block ${variantStyle.breadcrumbCurrent}`}>
                                            {currentPage}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        )}
                    </div>

                    <AppHoverClickCard
                        trigger={
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={image ?? img.src} />
                                <AvatarFallback>N/A</AvatarFallback>
                            </Avatar>
                        }
                        content={<UserCardContent />}
                        className="w-60"
                    />
                </div>
                <main className="p-4">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
};
export default AppSideBar;
