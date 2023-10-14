'use client';

import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { users } from '@/db/schema';
import { Menu } from 'lucide-react';
import Link from 'next/link';

type NavParent = {
    label: string;
    children: NavItem[];
};

type NavItem = {
    label: string;
    href: string;
    isExternal?: boolean;
};

function NavItem({ item }: { item: NavItem | NavParent }) {
    return (
        <NavigationMenuItem>
            {'children' in item ? (
                <>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-fit whitespace-nowrap p-4">
                        {item.children.map((child) => (
                            <NavChild item={child} key={child.label} />
                        ))}
                    </NavigationMenuContent>
                </>
            ) : (
                <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.label}</NavigationMenuLink>
                </Link>
            )}
        </NavigationMenuItem>
    );
}

function NavChild({ item }: { item: NavItem }) {
    const Component = item.isExternal ? 'a' : Link;

    return <Component href={item.href}>{item.label}</Component>;
}

function MobileNavItem({ item }: { item: NavItem | NavParent }) {
    return 'children' in item ? (
        <div className="flex flex-col">
            <div className="font-bold">{item.label}</div>
            <div className="ml-4 flex flex-col">
                {item.children.map((child) => (
                    <NavChild item={child} key={child.label} />
                ))}
            </div>
        </div>
    ) : (
        <NavChild item={item} />
    );
}

export default function Navbar({ currentUser }: { currentUser: typeof users.$inferSelect | null }) {
    const navItems: (NavParent | NavItem)[] = [];

    if (currentUser) {
        navItems.push({
            label: currentUser.displayName,
            children: [
                {
                    label: 'Sign Out',
                    href: '/auth/signout',
                    isExternal: true,
                },
            ],
        });
    } else {
        navItems.push({
            label: 'Sign In',
            href: '/auth',
            isExternal: true,
        });
    }

    return (
        <header className="flex h-12 flex-row items-center justify-between border-b p-2">
            <Link href="/" className="font-bold">
                Gumpjam
            </Link>
            <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                    {navItems.map((item) => (
                        <NavItem item={item} key={item.label} />
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <Sheet>
                <SheetTrigger className="flex md:hidden" asChild>
                    <Button variant="ghost">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    {navItems.map((item) => (
                        <MobileNavItem item={item} key={item.label} />
                    ))}
                </SheetContent>
            </Sheet>
        </header>
    );
}
