"use client";
import { ReactNode } from "react";
import SidebarAdmin from "./_components/sidebarAdmin";
import { ThemeProvider } from "@/components/common/themeProvider";
const AdminLayout = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <div className="w-full min-h-screen bg-gray-50">
                <SidebarAdmin >
                    <main className="p-4">{children}</main>
                </SidebarAdmin>
            </div>
        </ThemeProvider>
    );
};

export default AdminLayout;
