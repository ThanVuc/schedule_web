"use client";
import { ThemeProvider } from "@/components/common/themeProvider";
import { StarBackground } from "./_components";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <StarBackground />
                <div className="relative z-0 min-h-screen">
                    {children}
                </div>
            </ThemeProvider>

        </>
    );
}

export default RootLayout;
