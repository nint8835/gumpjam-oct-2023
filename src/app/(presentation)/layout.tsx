import '@/app/globals.css';
import type { Metadata } from 'next';

// TODO: Actual details?
export const metadata: Metadata = {
    title: 'Gumpjam - Presentation',
    description: 'My entry for the October 2023 Gumpjam',
};

export default async function PresentationRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="dark h-screen overflow-hidden">{children}</body>
        </html>
    );
}
