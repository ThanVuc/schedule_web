"use client";

import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import Head from "next/head";
import { AppProvider } from "@/context/app.context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  return (
    <html lang="en" suppressHydrationWarning >
      <Head>
        <title>Schedulr</title>
        <meta name="description" content="Ứng dụng lịch trình của bạn" />
      </Head>

      <body
        className={`antialiased`}
        suppressHydrationWarning
      >
        <AppProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AppProvider>
      </body>
    </html>
  );
}
