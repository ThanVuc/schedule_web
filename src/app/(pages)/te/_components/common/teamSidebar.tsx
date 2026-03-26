"use client";

import React, { ReactNode, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppHoverClickCard, AppSearch } from "@/components/common";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { UserCardContent } from "@/app/(pages)/(main)/_components";
import { AppBellNotification } from "@/components/common";
import img from "@/../public/assets/e145d5f684c1d0a465722a583e09904e.jpg";
import { Users, Bell, Settings, Menu, X } from "lucide-react";
import Link from "next/link";


const SIDEBAR_ABBR = "Nhóm";

const SIDEBAR_ITEMS = [
    { title: "Nhóm", url: "/te/group", icon: Users },
    { title: "Thông báo", url: "/te/notification", icon: Bell },
    { title: "Cài đặt", url: "/te/setting", icon: Settings },
];

const USER_IMAGE = img.src;


const TeamSidebar = ({
    children
}: {
    children: ReactNode;
    currentPage: string;
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(true);

    return (
        <div className="flex h-screen bg-[#0B1120] text-white">
            <aside
                className={cn(
                    "relative flex flex-col border-r border-1 bg-[#1A2332] transition-all duration-300 ease-in-out",
                    open ? "w-65" : "w-[78px]"
                )}
            >
                <div className="flex h-17 items-center justify-between px-4 border-b-1">
                    {open && (
                        <Link href="/" className="text-lg font-bold text-blue-500 select-none">
                            {SIDEBAR_ABBR}
                        </Link>
                    )}
                    <Button
                        onClick={() => setOpen(!open)}
                        className={cn(
                            "bg-[#1A2332] flex items-center justify-center rounded-md p-1.5 text-white hover:bg-[#1E2A3A] hover:text-white transition-colors",
                            !open && "mx-auto"
                        )}
                    >
                        {open ? <X size={15} /> : <Menu size={20} />}
                    </Button>
                </div>
                <nav className="flex-1 px-4 pt-4 py-4 space-y-1">
                    {SIDEBAR_ITEMS.map((item) => {
                        const isActive = pathname === item.url;
                        return (
                            <button
                                key={item.title}
                                onClick={() => router.push(item.url)}
                                className={cn(
                                    "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                    isActive
                                        ? "bg-[#2A97EA] text-white"
                                        : "text-gray-400 hover:bg-[#1E2A3A] hover:text-white",
                                    !open && "justify-center px-2"
                                )}
                                title={!open ? item.title : undefined}
                            >
                                <item.icon size={20} className="shrink-0" />
                                {open && <span>{item.title}</span>}
                            </button>
                        );
                    })}
                </nav>

            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">

                <div className="flex h-15 items-center justify-between gap-4 border-b bg-[#1A2332] px-6">
                    <AppSearch className="bg-[#1A2332] w-auto flex" placeholder="Tìm kiếm" />
                    <div className="flex items-center gap-3 ">
                        <AppBellNotification />
                        <AppHoverClickCard
                            trigger={
                                <Avatar className="cursor-pointer w-9 h-9">
                                    <AvatarImage src={USER_IMAGE} />
                                    <AvatarFallback className="bg-[#1A2332] text-xs">
                                    </AvatarFallback>
                                </Avatar>
                            }
                            content={<UserCardContent />}
                            className="w-60"
                        />
                    </div>
                </div>
                <main className="flex-1 bg-[#0B1120] overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default TeamSidebar;