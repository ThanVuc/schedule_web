"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { AdminIcon } from "../icon";


export interface SidebarProp {
    array: {
        title: string;
        url: string;
        icon: React.ComponentType<{ className?: string }>;
    }[];
}


const SideBar = ({ array }: SidebarProp) => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Sidebar className="min-h-screen w-64 bg-white border-r shadow-lg">
            <SidebarContent className="p-4">

                <SidebarGroup>
                    <SidebarGroupLabel className="text-md font-bold uppercase tracking-wider px-2 mb-3">
                        <AdminIcon className="w-24 h-24 mr-1" />
                        Quản trị viên
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {array.map((item) => {
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
    );
};

export default SideBar;
