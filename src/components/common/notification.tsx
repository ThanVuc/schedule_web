import { 
    Alert, 
    AlertTitle, 
    AlertDescription, 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui'
import {  } from '@/components/ui'

interface AppNotificationProps {
    icon?: React.ReactNode;
    src?: string;
    alt?: string;
    title: string;
    description?: string;
}

export const AppNotification = (
    {
        icon,
        src,
        alt,
        title,
        description,
    }: AppNotificationProps
) => {
    return (
        <Alert className='flex items-center justify-between'>
            {
                icon ? (
                    <div className='mr-4'>{icon}</div>
                ) : (
                    <Avatar className='rounded-sm'>
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
                <AlertDescription>{description}</AlertDescription>
            </div>
        </Alert>
    )
}
