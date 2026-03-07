import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from 'next/font/google'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
            <div className={`${_geist.className} ${_geistMono.className}`}>
                {children}
            </div>
        </ThemeProvider>
    )
}
