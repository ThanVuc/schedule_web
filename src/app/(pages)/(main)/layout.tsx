"use client";
import { ThemeProvider } from "@/components/common/themeProvider";
import { AppHeader, StarBackground } from "./_components";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <StarBackground>
                    <div className="pt-25">
                        <AppHeader />
                        <div className="px-10">{children}</div>
                    </div>
                </StarBackground>
            </ThemeProvider>

        </>
    );
}

export default RootLayout;
