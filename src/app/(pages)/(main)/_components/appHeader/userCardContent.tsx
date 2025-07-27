import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui"
import avtImg from "@/../public/assets/e145d5f684c1d0a465722a583e09904e.jpg";
import { LogoutIcon, SettingsGearIcon, UserIcon } from "@/components/icon";
import Link from "next/link";

const userActions = [
    { href: "/profile", label: "Hồ sơ cá nhân", icon: <UserIcon className="w-4 h-4 mr-2" /> },
    { href: "/settings", label: "Cài đặt", icon: <SettingsGearIcon className="w-4 h-4 mr-2" /> },
    { href: "/logout", label: "Đăng xuất", icon: <LogoutIcon className="w-4 h-4 mr-2" /> },
]

export const UserCardContent = () => {
    return (
        <div>
            <div className="avt flex items-center gap-4 justify-center pb-2 border-b-2">
                <Avatar>
                    <AvatarImage src={avtImg.src} />
                    <AvatarFallback>N/A</AvatarFallback>
                </Avatar>
                <p className="text-lg font-extralight">Nguyễn Văn A</p>
            </div>
            <div className="actions">
                {userActions.map((action, index) => (
                    <Button key={index} variant="ghost" className="w-full text-left justify-start">
                        <Link href={action.href} className="flex gap-2 transition-colors duration-200">
                            {action.icon}
                            <span>{action.label}</span>
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    )
}