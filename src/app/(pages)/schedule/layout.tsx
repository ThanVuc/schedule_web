import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import SidebarSchedule from "./_components/sidebarSchedule";

export const metadata = {
    title: "Lịch Trình | Schedulr",
    description: "Quản lý và xem lịch trình của bạn",
}

const ScheduleLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster richColors position="top-right" expand={false} theme="dark" className="app-toaster" />
            <SidebarSchedule>
                <div className="px-10 mb-10">
                    {children}
                </div>
            </SidebarSchedule>
        </ThemeProvider>
    )
}

export default ScheduleLayout;
