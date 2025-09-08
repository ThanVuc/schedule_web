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
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary>{children}</ErrorBoundary>         
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
