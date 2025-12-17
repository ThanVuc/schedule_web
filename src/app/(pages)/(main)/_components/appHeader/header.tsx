import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import "./header.scss";
import { AdminIcon, HelpIcon, HomeIcon, Schedulr, ScheduleIcon, TeamIcon } from "@/components/icon";
import Link from "next/link";
import { AppBellNotification, AppHoverClickCard } from "@/components/common";
import img from "@/../public/assets/e145d5f684c1d0a465722a583e09904e.jpg";
import { UserCardContent } from "./userCardContent";
import { useHasPermission, useIsIpad, useIsMobile } from "@/hooks";
import { useRouter } from "next/navigation";
import { useMe } from "@/context/me.context";
import { APP_ACTIONS } from "@/constant/actionACL";
import APP_RESOURCES from "@/constant/resourceACL";

export const AppHeader = () => {
    const isMobile = useIsMobile();
    const isIpad = useIsIpad();
    const router = useRouter();
    const meContext = useMe();
    const [canReadAllRole, canReadAllUser, canReadAllPermission] = useHasPermission([
        { resource: APP_RESOURCES.ROLE, action: APP_ACTIONS.READ_ALL },
        { resource: APP_RESOURCES.USER, action: APP_ACTIONS.READ_ALL },
        { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.READ_ALL },
    ]);
    const hasAdminPermission = canReadAllRole || canReadAllUser || canReadAllPermission;
    const baseItem = [
        { href: "/", label: "Trang Chủ", icon: <HomeIcon className="!w-6 !h-6" /> },
        { href: "/schedule", label: "Lịch Trình", icon: <ScheduleIcon className="!w-6 !h-6" /> },
        { href: "/teams", label: "Nhóm", icon: <TeamIcon className="!w-5 !h-5" /> },
    ]
    const adminAction = hasAdminPermission
        ? [{ href: "/admin", label: "Quản Trị", icon: <AdminIcon className="!w-5 !h-5" /> }]
        : [];
    const NavItemData = [
        ...baseItem,
        ...adminAction,
        { href: "/support", label: "Hỗ Trợ", icon: <HelpIcon className="!w-6 !h-6" /> },
    ]

    return (
        <div className={`app-header fixed top-0 left-0 w-full flex items-center ${isMobile || isIpad ? "justify-between" : "justify-evenly"} p-4 md:p-6 bg-background z-50`}>
            <Button className="home" variant="ghost">
                <Link href="/" className="flex items-center gap-3 p-2 md:p-4">
                    <Schedulr className="text-blue-300" style={{ width: '2rem', height: '2rem' }} />
                    <span className="sm:inline text-2xl md:text-3xl text-blue-300 font-semibold">Schedulr</span>
                </Link>
            </Button>

            {/* Top nav for desktop only */}
            <nav className="hidden lg:flex navigator gap-4">
                {NavItemData.map((item, index) => (
                    <Button key={index} variant="ghost" className="nav-item">
                        <Link
                            className="link-item flex items-center gap-2 text-blue-300 hover:text-blue-500 transition-colors duration-200"
                            href={item.href}
                        >
                            {item.icon}
                            <span className="hidden xl:inline">{item.label}</span>
                        </Link>
                    </Button>
                ))}
            </nav>

            {/* Bottom nav for mobile + iPad */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-blue-800/40 flex justify-around items-center py-2 backdrop-blur-md">
                {NavItemData.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className="flex flex-col items-center justify-center text-blue-300 hover:text-blue-500 transition-all duration-200"
                    >
                        <div className="p-2">{item.icon}</div>
                        <span className="text-xs">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="user">
                {meContext?.me ? (
                    <div className="relative flex items-center gap-4">
                        <AppBellNotification />

                        <AppHoverClickCard
                            trigger={
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={img.src} />
                                    <AvatarFallback>N/A</AvatarFallback>
                                </Avatar>
                            }
                            content={<UserCardContent />}
                            className="w-60"
                        />
                    </div>
                ) : (
                    <div>
                        <Button variant="default" className="login hover:cursor-pointer"
                            onClick={() => {
                                router.push('/login');
                            }}
                        >
                            Đăng Nhập
                        </Button>
                    </div>
                )}
            </div>
        </div>

    )
}
