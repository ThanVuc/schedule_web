"use client";
import { ReactNode } from "react";
import SidebarAdmin from "./_components/sidebarAdmin";
const AdminLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full min-h-screen bg-gray-50">
            <SidebarAdmin >
                <main className="p-4">{children}</main>
            </SidebarAdmin>
        </div>
    );
};

export default AdminLayout;
