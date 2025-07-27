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
                <StarBackground>
                    {children}
                </StarBackground>
            </ThemeProvider>

        </>
    );
}

export default RootLayout;
