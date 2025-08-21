"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { CsrfProvider } from "@/context/csrf.context";
import { getCSRFToken } from "@/lib/utils";
import { useEffect, useState } from "react";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getCSRFToken();
        setCsrfToken(token || "");
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        setCsrfToken("");
      }
    };
    fetchToken();
  }, []);

  
  return (
    <html lang="en" suppressHydrationWarning >
      <Head>
        <title>Schedulr</title>
        <meta name="description" content="Ứng dụng lịch trình của bạn" />
      </Head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CsrfProvider token={csrfToken}>
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster richColors position="top-right" expand={false} theme="light" className="app-toaster" />
        </CsrfProvider>
      </body>
    </html>
  );
}
