import {
    Alert,
    AlertTitle,
    AlertDescription,
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui'
import { } from '@/components/ui'

interface AppNotificationProps {
    icon?: React.ReactNode;
    src?: string;
    alt?: string;
    title: string;
    body?: string;
    url?: string;
    onClick?: () => void;
}

export const AppNotification = (
    {
        icon,
        src,
        alt,
        title,
        body,
        url,
        onClick
    }: AppNotificationProps
) => {
    const handleClick = () => {
        if (url) {
            window.open(url, '_blank');
        }
    }

    return (
        <Alert onClick={() => {
            handleClick();
            if (onClick) onClick();
        }}
            className='
                fixed bottom-3 left-3 z-50
                max-w-xs w-full sm:w-80
                flex items-center gap-2
                bg-white dark:bg-neutral-900
                border border-gray-200 dark:border-neutral-700
                rounded-lg shadow-md
                px-3 py-2
                cursor-pointer
                transition-all duration-300
                animate-in slide-in-from-bottom fade-in
                hover:scale-[1.01]
            '>
            {
                icon ? (
                    <div className='mr-4'>{icon}</div>
                ) : (
                    <Avatar className='rounded-full'>
                        <AvatarImage
                            src={src}
                            alt={alt ?? "Image"}
                            className='rounded-sm'
                        />
                        <AvatarFallback className='text-xs'>HR</AvatarFallback>
                    </Avatar>
                )
            }
            <div className='flex-1 flex-col justify-center gap-1'>
                <AlertTitle className='flex-1'>{title}</AlertTitle>
                <AlertDescription>{body}</AlertDescription>
            </div>
        </Alert>
    )
}
