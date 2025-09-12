import { InfiniteSpinner } from "@/components/common";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/app.context";
import { Suspense } from "react";

export const metadata = {
  title: "Schedulr",
  description: "Ứng dụng lịch trình của bạn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`antialiased`}
        suppressHydrationWarning
      >
        <AppProvider>
          <Suspense fallback={<InfiniteSpinner className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}>
            <ErrorBoundary>{children}</ErrorBoundary>         
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
