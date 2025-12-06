'use client';

import {
    Alert,
    AlertTitle,
    AlertDescription,
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui'

interface AppNotificationProps {
    src?: string;
    alt?: string;
    title: string;
    body?: string;
    url?: string;
    onClick?: () => void;
}

const DEFAULT_SRC = "https://www.schedulr.site/assets/image%208.png";

export const AppNotification = ({
    src,
    alt,
    title,
    body,
    url,
    onClick
}: AppNotificationProps) => {
    const handleClick = () => {
        if (url) {
            window.open(url, '_blank');
        }
    }

    return (
        <Alert
            onClick={() => {
                handleClick();
                if (onClick) onClick();
            }}
            className="
                fixed bottom-3 right-3 z-50
                max-w-xs w-full sm:w-80
                flex items-center gap-2
                bg-white dark:bg-neutral-900
                border border-gray-200 dark:border-neutral-700
                rounded-lg
                px-3 py-2
                cursor-pointer
                transition-all duration-300
                overflow-hidden
                hover:scale-[1.03]
                animate-in slide-in-from-bottom fade-in
                dark:border-r-2 dark:border-r-gray-600
            "
            style={{
                boxShadow: '0 2px 6px oklch(0.42 0.05 265 / 0.55)',
                transition: 'box-shadow 0.3s ease, transform 0.3s ease'
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 3px 8px oklch(0.50 0.06 265 / 0.75)'; // subtle hover
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 6px oklch(0.50 0.06 265 / 0.75)'; // default thin shadow
            }}
        >
            <Avatar className="rounded-full">
                <AvatarImage src={src === "" ? DEFAULT_SRC : src} alt={alt ?? "Image"} className="rounded-sm" />
                <AvatarFallback className="text-xs">HR</AvatarFallback>
            </Avatar>

            <div className="flex-1 flex-col justify-center gap-1">
                <AlertTitle className="flex-1">{title}</AlertTitle>
                <AlertDescription>{body}</AlertDescription>
            </div>
        </Alert>
    )
}
