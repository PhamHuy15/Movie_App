import type { Metadata } from 'next';
import '@/app/globals.css';
import { AppHeader } from '@/components/layout/app-header';
import { DesktopSidebar } from '@/components/layout/desktop-sidebar';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { AppFooter } from '@/components/layout/app-footer';
import { siteConfig } from '@/config/site';
import { Be_Vietnam_Pro, Oswald } from 'next/font/google';

const sans = Be_Vietnam_Pro({
    subsets: ['latin', 'vietnamese'],
    variable: '--font-sans',
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
});

const display = Oswald({
    subsets: ['latin', 'vietnamese'],
    variable: '--font-display',
    weight: ['600', '700'],
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${siteConfig.name} — Điện ảnh của bạn`, template: `%s | ${siteConfig.name}` },
    description: siteConfig.description,
    openGraph: { type: 'website', locale: 'vi_VN', siteName: siteConfig.name },
    twitter: { card: 'summary_large_image' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="vi" className={`${sans.variable} ${display.variable}`}>
            <body>
                <AppHeader />
                <DesktopSidebar />
                <main className="min-h-screen pb-20 md:ml-20 md:pb-0 xl:ml-56">{children}</main>
                <div className="md:ml-20 xl:ml-56">
                    <AppFooter />
                </div>
                <MobileBottomNav />
            </body>
        </html>
    );
}
