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
                fixed bottom-4 right-4 z-50
                max-w-sm w-full sm:w-[360px]
                flex items-center gap-3
                bg-white dark:bg-neutral-900
                border border-gray-200 dark:border-neutral-700
                rounded-xl
                px-4 py-3
                cursor-pointer
                transition-all duration-300
                overflow-hidden
                hover:scale-[1.03]
                animate-in slide-in-from-bottom fade-in
                dark:border-r-2 dark:border-r-gray-600
            "
            style={{
                boxShadow: '0 4px 10px oklch(0.42 0.05 265 / 0.55)',
                transition: 'box-shadow 0.3s ease, transform 0.3s ease'
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                    '0 5px 12px oklch(0.50 0.06 265 / 0.75)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                    '0 4px 10px oklch(0.42 0.05 265 / 0.55)';
            }}
        >
            <Avatar className="w-12 h-12 min-w-12 min-h-12 rounded-full border">
                <AvatarImage
                    src={src === "" ? DEFAULT_SRC : src}
                    alt={alt ?? "Image"}
                    className="w-full h-full rounded-full object-cover"
                />
                <AvatarFallback className="text-sm">HR</AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-1 gap-1">
                <AlertTitle className="text-[1rem] font-semibold leading-tight">
                    {title}
                </AlertTitle>

                <AlertDescription className="text-[0.9rem] leading-snug">
                    {body}
                </AlertDescription>
            </div>
        </Alert>
    );
};
