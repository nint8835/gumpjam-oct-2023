import Navbar from '@/components/navbar';
import type { Metadata } from 'next';
import './globals.css';

// TODO: Actual details?
export const metadata: Metadata = {
    title: 'Gumpjam - October 2023',
    description: 'My entry for the October 2023 Gumpjam',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="dark min-h-screen">
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <div className="flex-1">{children}</div>
                </div>
            </body>
        </html>
    );
}
