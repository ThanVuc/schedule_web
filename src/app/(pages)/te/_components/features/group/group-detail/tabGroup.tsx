'use client';

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { GROUP_TABS, TabKey, TabConfig } from "../../../../_constants";
import { Button } from "@/components/ui";

export type { TabKey, TabConfig };
export { GROUP_TABS };

export function useActiveTab(defaultTab: TabKey = "members"): TabKey {
    const searchParams = useSearchParams();
    const raw = searchParams.get("tab");
    const valid = GROUP_TABS.map((t) => t.key);
    return (valid.includes(raw as TabKey) ? raw : defaultTab) as TabKey;
}

function GroupAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name}
                className="w-35 h-35 rounded-full object-cover ring-2 ring-[#1E2A3A] shrink-0"
            />
        );
    }


    return (
        <div
            className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center shrink-0",
                "bg-gradient-to-br ring-2 ring-[#1E2A3A] text-white text-base font-semibold select-none",
            )}
        >
            {initials}
        </div>
    );
}

interface TabGroupProps {
    className?: string;
}

export const TabGroup = ({ className }: TabGroupProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = useActiveTab();

    const groupName = searchParams.get("name") ?? "Group";
    const memberCount = Number(searchParams.get("memberCount") ?? 0);

    const navigate = (key: TabKey) => {
        const params = new URLSearchParams({
            tab: key,
            name: groupName,
            memberCount: String(memberCount),
        });
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className={cn(" top-0 sticky z-[50]", className)}>
            <div className="flex items-center gap-4 px-6 py-8 bg-[#0B1120]">
                <Button
                    onClick={() => router.back()}
                    aria-label="back"
                    className={cn(
                        "flex bg-[#0B1120] items-center justify-center w-10 h-10 rounded-full shrink-0",
                        "text-gray-400 hover:text-white hover:bg-[#1E2A3A]",
                        "transition-colors duration-150 outline-none",
                        "focus-visible:ring-2 focus-visible:ring-[#1565C0]/50",
                    )}
                >
                    <ArrowLeft size={25} />
                </Button>

                <GroupAvatar name={groupName} />

                <div className="flex flex-col min-w-0">
                    <span className="text-3xl font-bold text-white leading-tight truncate">
                        {groupName}
                    </span>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {memberCount} thành viên
                    </p>
                </div>
            </div>

            <div
                className="bg-[#0B1120] flex items-end gap-0 overflow-x-auto no-scrollbar
                             border-[#1E2A3A] px-2 border-t"
            >
                {GROUP_TABS.map(({ key, label }) => {
                    const isActive = activeTab === key;
                    return (
                        <Button
                            key={key}
                            onClick={() => navigate(key)}
                            className={cn(
                                "bg-[#0B1120] hover:bg-[#0B1120] relative flex items-center gap-2 px-4 py-3 text-sm font-medium",
                                "whitespace-nowrap transition-colors duration-150 outline-none shrink-0",
                                "focus-visible:ring-2 focus-visible:ring-[#1565C0]/50 rounded-t-md",
                                isActive
                                    ? "text-white"
                                    : "text-gray-500 hover:text-gray-300",
                            )}
                            aria-selected={isActive}
                            role="tab"
                        >
                            <span
                                className={cn(
                                    "transition-colors duration-150",
                                    isActive ? "text-[#42A5F5]" : "text-gray-600",
                                )}
                            >
                            </span>

                            {label}

                            {isActive && (
                                <span
                                    className="absolute inset-x-0 bottom-0 h-[2px] rounded-full
                                               bg-gradient-to-r from-[#1565C0] via-[#42A5F5] to-[#1565C0]"
                                />
                            )}
                        </Button>
                    );
                })}
            </div>
            <div className="border-b w-4/9">

            </div>
        </div>
    );
};