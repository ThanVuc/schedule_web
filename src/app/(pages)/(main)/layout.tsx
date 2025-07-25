"use client";
import { ThemeProvider } from "@/components/common/themeProvider";
import { StarBackground } from "./_components";

const testItem = Array.from({ length: 100 }, (_, i) => `test${i + 1}`);

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
                    {testItem.map((item, index) => (
                        <div key={index} className="text-white text-center">
                            {item}
                            <br />
                        </div>
                    ))}
                    {children}
                </div>
            </ThemeProvider>

        </>
    );
}

export default RootLayout;
