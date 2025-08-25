import { ReactNode } from "react";
import SidebarAdmin from "./_components/sidebarAdmin";
import { ThemeProvider } from "@/components/common/themeProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
    title: "Quản Trị | Schedulr",
    description: "Quản lý người dùng và cài đặt hệ thống",
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster richColors position="top-right" expand={false} theme="light" className="app-toaster" />
            <div className="w-full min-h-screen bg-gray-50">
                <SidebarAdmin >
                    <main className="p-4">{children}</main>
                </SidebarAdmin>
            </div>
        </ThemeProvider>
    );
};

export default AdminLayout;
