import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import "./header.scss";
import { AdminIcon, HelpIcon, HomeIcon, Schedulr, ScheduleIcon, TeamIcon } from "@/components/icon";
import Link from "next/link";
import { AppHoverClickCard } from "@/components/common";
import img from "@/../public/assets/e145d5f684c1d0a465722a583e09904e.jpg";
import { UserCardContent } from "./userCardContent";
import { useHasPermission, useIsMobile } from "@/hooks";
import { useRouter } from "next/navigation";
import { useMe } from "@/context/me.context";
import { APP_ACTIONS } from "@/constant/actionACL";
import APP_RESOURCES from "@/constant/resourceACL";


export const AppHeader = () => {
    const isMobile = useIsMobile();
    const router = useRouter();
    const meContext = useMe();
    const [canReadAllRole, canReadAllUser, canReadAllPermission] = useHasPermission([
        { resource: APP_RESOURCES.ROLE, action: APP_ACTIONS.READ_ALL },
        { resource: APP_RESOURCES.USER, action: APP_ACTIONS.READ_ALL },
        { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.READ_ALL },
    ]);
    const hasAdminPermission = canReadAllRole || canReadAllUser || canReadAllPermission;
    const baseItem = [
        { href: "/", label: "Trang Chủ", icon: <HomeIcon /> },
        { href: "/schedule", label: "Lịch Trình", icon: <ScheduleIcon /> },
        { href: "/teams", label: "Nhóm", icon: <TeamIcon /> },
    ]
    const adminAction = hasAdminPermission
        ? [{ href: "/admin", label: "Quản Trị", icon: <AdminIcon className="w-4 h-4 mr-2" /> }]
        : [];
    const NavItemData = [
        ...baseItem,
        ...adminAction,
        { href: "/support", label: "Hỗ Trợ", icon: <HelpIcon /> },
    ]

    return (
        <div className="app-header fixed top-0 left-0 w-full flex items-center justify-between p-4 md:p-6 bg-background z-50">
            <div className="flex items-center gap-6">
                <Button className="home" variant="ghost">
                    <Link href="/" className="flex items-center gap-3 p-2 md:p-4">
                        <Schedulr className="text-blue-300" style={{ width: '2rem', height: '2rem' }} />
                        <span className="hidden sm:inline text-2xl md:text-3xl text-blue-300 font-semibold">Schedulr</span>
                    </Link>
                </Button>

                <nav className="md:flex navigator gap-4">
                    {NavItemData.map((item, index) => (
                        <Button key={index} variant='ghost' className="nav-item">
                            <Link className="link-item flex items-center
                                gap-2 text-blue-300 hover:text-blue-500 transition-colors duration-200"
                                href={item.href}>
                                {item.icon}
                                {isMobile ? null : <span className="hidden md:inline">{item.label}</span>}
                            </Link>
                        </Button>
                    ))}
                </nav>
            </div>

            <div className="user ml-auto">
                {meContext?.me ? (
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
