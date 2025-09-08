"use client";

import { ThemeProvider } from "@/components/common/themeProvider";
import { AppHeader, StarBackground } from "./_components";
import { Toaster } from "@/components/ui/sonner";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <Toaster richColors position="top-right" expand={false} theme="dark" className="app-toaster" />
                <StarBackground>
                    <div className="pt-20 px-10 mb-10">
                        <AppHeader />
                        {children}
                    </div>
                </StarBackground>
            </ThemeProvider>
        </>
    );
}

export default RootLayout;
