import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { ssrGetCurrentUser } from '@/lib/auth';
import type { Metadata } from 'next';
import './globals.css';

// TODO: Actual details?
export const metadata: Metadata = {
    title: 'Gumpjam - October 2023',
    description: 'My entry for the October 2023 Gumpjam',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const currentUser = await ssrGetCurrentUser();

    return (
        <html lang="en">
            <body className="dark h-screen">
                <div className="h-full">
                    <Navbar currentUser={currentUser} />
                    <div className="h-[calc(100vh_-_3rem)] overflow-scroll">{children}</div>
                </div>
                <Toaster />
            </body>
        </html>
    );
}
