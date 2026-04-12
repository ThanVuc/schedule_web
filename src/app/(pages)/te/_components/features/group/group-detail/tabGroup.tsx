'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { GROUP_TABS, TabKey, TabConfig } from "../../../../_constants";
import { Button } from "@/components/ui";
import { useAxios } from "@/hooks";
import { teamGroupApiUrl } from "@/api/teamGroup";

export type { TabKey, TabConfig };
export { GROUP_TABS };

export function useActiveTab(defaultTab: TabKey = "members"): TabKey {
    const searchParams = useSearchParams();
    const raw = searchParams.get("tab");
    const valid = GROUP_TABS.map((t) => t.key);
    return (valid.includes(raw as TabKey) ? raw : defaultTab) as TabKey;
}

function GroupAvatar({ name }: { name: string; avatarUrl?: string }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <div
            className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center shrink-0",
                "bg-gradient-to-br ring-2 ring-[#00a5fe] text-white text-base font-semibold select-none",
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

    const params = useParams<{ id: string }>();
    const groupId = params?.id ?? "";
    const [activeGroupId, setActiveGroupId] = useState(groupId);

    useEffect(() => {
        setActiveGroupId(groupId);
    }, [groupId]);

    type GroupDetailApiModel = {
        id?: string;
        group_id?: string;
        name?: string;
        group_name?: string;
        members_total?: number;
        avatar_url?: string;
        owner?: { avatar?: string } | null;
    };

    const { data: groupDetailRaw, error: groupDetailError } = useAxios<GroupDetailApiModel | { group?: GroupDetailApiModel; item?: GroupDetailApiModel; data?: GroupDetailApiModel }>({
        method: "GET",
        url: teamGroupApiUrl.detail(activeGroupId),
    }, [activeGroupId], !activeGroupId);

    const groupDetail = ((): GroupDetailApiModel | null => {
        const raw = groupDetailRaw as any;
        if (!raw) return null;
        if (raw.name || raw.group_name || raw.member_total !== undefined) return raw as GroupDetailApiModel;
        if (raw.group) return raw.group as GroupDetailApiModel;
        if (raw.item) return raw.item as GroupDetailApiModel;
        if (raw.data && (raw.data.name || raw.data.group_name)) return raw.data as GroupDetailApiModel;
        return raw as GroupDetailApiModel;
    })();

    const groupName = groupDetail?.name || groupDetail?.group_name || "Group";
    const memberCount = Number(groupDetail?.members_total ?? 0);
    const avatarUrl = groupDetail?.avatar_url || groupDetail?.owner?.avatar || undefined;
    const hasForbiddenError = groupDetailError?.response?.status === 422;

    const navigate = (key: TabKey) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", key);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            <div className={cn("flex items-center gap-4 px-6 py-8 bg-[#0B1120] border-b border-[#1E2A3A]", className)}>
                <Button
                    onClick={() => router.push("/te/group")}
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

                <GroupAvatar name={groupName} avatarUrl={avatarUrl} />

                <div className="flex flex-col min-w-0">
                    <span className="text-3xl font-bold text-white leading-tight truncate">
                        {groupName}
                    </span>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {hasForbiddenError
                            ? "Bạn không có quyền truy cập group này"
                            : `${memberCount} thành viên`}
                    </p>
                </div>
            </div>
            <div className="sticky top-0 z-10 bg-[#0B1120] border-b border-[#1E2A3A]">
                <div className="flex items-end gap-0 overflow-x-auto no-scrollbar px-2">
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
                                />

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
            </div>
        </>
    );
};