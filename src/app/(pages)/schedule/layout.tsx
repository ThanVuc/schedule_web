import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { StarBackground } from "./_components";

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
            <StarBackground>
                <div className="px-10 mb-10">
                    {children}
                </div>
            </StarBackground>
        </ThemeProvider>
    )
}

export default ScheduleLayout;
