
"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Bell,
    LogOut,
    Search,
    User2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
    faPenToSquare,
    faLock,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { PenToSquareIcon } from "@/components/icon";

interface HeaderProps {
    userName: string;
    userRole: string;
    logoUrl?: string;
    siteName?: string;
    avatarUrl?: string;
}

const endpoints = "/personal-account";
const menuItems = [
    { href: `${endpoints}/personal-info`, icon: faUser, label: "Thông tin cá nhân" },
    { href: `${endpoints}/edit-profile`, icon: faPenToSquare, label: "Chỉnh sửa thông tin" },
    { href: `${endpoints}/reset-pass`, icon: faLock, label: "Đặt lại mật khẩu" },
];

export const Header = ({
    userName,
    userRole,
    siteName = "Tên Website",
    logoUrl,
    avatarUrl,
}: HeaderProps) => {
    const handleLogout = () => {
        alert("Đăng xuất thành công!");
    };

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const dropdownAnimation =
        "animate-in fade-in zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95";

    return (
        <div className="h-16 w-full z-100">
            <div className="fixed h-16 w-full flex items-center justify-between px-4 sm:px-6 bg-gray-50 border-b border-gray-200 shadow-sm z-50">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 min-w-0">
                    {logoUrl && (
                        <Image
                            src={logoUrl}
                            alt="Logo"
                            width={32}
                            height={32}
                            className="rounded-full bg-white"
                        />
                    )}
                    <span className="text-sm sm:text-base font-semibold italic text-gray-800 whitespace-nowrap">
                        {siteName}
                    </span>
                </Link>

                {/* Right Section */}
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-shrink-0">
                    {/* Search */}
                    <div className="flex hidden sm:flex  items-center bg-white border border-gray-300 rounded px-2 h-10 min-w-0 w-[140px] sm:w-[200px]">
                        <Search className="w-4 h-4 text-gray-500 mr-1" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="h-8 border-none text-sm focus-visible:ring-0 p-0 placeholder:text-xs w-full"
                        />
                    </div>

                    {/* Notification */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5 text-gray-700" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                    </Button>

                    {/* User Info */}
                    <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                        <PopoverTrigger
                            onClick={(e) => {
                                e.preventDefault();
                                setIsUserMenuOpen(!isUserMenuOpen);
                            }}
                            className="flex cursor-pointer items-center bg-gray-100 rounded-2xl px-3 sm:px-5 py-2 shadow-sm border border-gray-200 min-w-0 max-w-full"
                        >
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center overflow-hidden">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={userName}
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="h-full w-full rounded-full bg-purple-200 flex items-center justify-center">
                                        <User2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                    </div>
                                )}
                            </div>


                            <div className="hidden sm:flex flex-col ml-2 truncate">
                                <span className="text-sm font-medium text-gray-800 truncate">
                                    Tên: {userName}
                                </span>

                            </div>
                        </PopoverTrigger>

                        {/* Dropdown menu */}
                        <PopoverContent className={`w-52 p-2 ${dropdownAnimation}`} align="end">
                            {/* Hiển thị tên và vai trò trong dropdown */}
                            <div className="px-3 pb-2 border-b border-gray-200 mb-2">
                                <div className="font-medium text-sm text-gray-800 truncate">
                                    {userName}
                                </div>
                                <div className="text-xs text-gray-500">{userRole}</div>
                            </div>

                            <ul className="text-sm">
                                {menuItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-100"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 rounded w-full text-left px-3 py-2 hover:bg-gray-100"
                                    >
                                        <LogOut className="w-4 h-4" /> Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}