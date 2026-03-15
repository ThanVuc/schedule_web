import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google'
import { Sidebar } from './_components/common';

const _geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Team Groups - SaaS Management',
    description: 'Modern SaaS group management platform',
    generator: 'v0.app',
    icons: {
        icon: [
            {
                url: '/icon-light-32x32.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/icon-dark-32x32.png',
                media: '(prefers-color-scheme: dark)',
            },
            {
                url: '/icon.svg',
                type: 'image/svg+xml',
            },
        ],
        apple: '/apple-icon.png',
    },
}

export default function TeamLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster richColors position="top-right" expand={false} theme="dark" className="app-toaster" />
            <Sidebar currentPage='/te/group'>
                <div className={`${_geist.className} ${_geist.className}`}>
                    {children}
                </div>
            </Sidebar>
        </ThemeProvider>
    )
}
