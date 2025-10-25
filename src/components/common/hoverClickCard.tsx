"use client";

import { useIsIpad, useIsMobile } from "@/hooks";
import { AppClickCard } from "./clickCardMobile";
import { AppHoverCard } from "./hoverCard";

interface AppHoverClickCardProps {
    trigger: React.ReactNode;
    avatarSrc?: string;
    avatarFallback?: string;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    content?: React.ReactNode;
    className?: string;
}

export const AppHoverClickCard = ({
    trigger,
    avatarSrc,
    avatarFallback = "NA",
    title,
    description,
    footer,
    content,
    className = "w-80"
}: AppHoverClickCardProps) => {
    const isMobile = useIsMobile();
    const isIpad = useIsIpad();

    return (
        <div>
            {isMobile || isIpad ? (
                <AppClickCard
                    trigger={trigger}
                    avatarSrc={avatarSrc}
                    avatarFallback={avatarFallback}
                    title={title}
                    description={description}
                    footer={footer}
                    content={content}
                    className={className}
                />
            ) : (
                <AppHoverCard
                    trigger={trigger}
                    avatarSrc={avatarSrc}
                    avatarFallback={avatarFallback}
                    title={title}
                    description={description}
                    footer={footer}
                    content={content}
                    className={className}
                />
            )}
        </div>
    );
}