import ClientProviders from '@/components/client_providers';
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
            <body className="dark min-h-screen">
                <ClientProviders>
                    <div className="flex min-h-screen flex-col">
                        <Navbar currentUser={currentUser} />
                        <div className="flex-1">{children}</div>
                    </div>
                    <Toaster />
                </ClientProviders>
            </body>
        </html>
    );
}
