'use client';

import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { users } from '@/db/schema';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ currentUser }: { currentUser: typeof users.$inferSelect | null }) {
    return (
        <header className="flex h-12 flex-row items-center justify-between border-b p-2">
            <Link href="/" className="font-bold">
                Gumpjam
            </Link>
            <NavigationMenu className="hidden md:flex">
                <NavigationMenuList></NavigationMenuList>
            </NavigationMenu>
            <Sheet>
                <SheetTrigger className="flex md:hidden" asChild>
                    <Button variant="ghost">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent>{JSON.stringify(currentUser)}</SheetContent>
            </Sheet>
        </header>
    );
}
