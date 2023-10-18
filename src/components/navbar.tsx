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
import { useState } from 'react';

type NavParent = {
    label: string;
    children: NavItem[];
};

type NavItem = {
    label: string;
    href: string;
    isExternal?: boolean;
};

function NavItem({ item, setIsOpen }: { item: NavItem | NavParent; setIsOpen: (isOpen: boolean) => void }) {
    return (
        <NavigationMenuItem>
            {'children' in item ? (
                <>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="flex min-w-fit flex-col gap-2 whitespace-nowrap p-4">
                        {item.children.map((child) => (
                            <NavChild item={child} key={child.label} setIsOpen={setIsOpen} />
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

function NavChild({ item, setIsOpen }: { item: NavItem; setIsOpen: (isOpen: boolean) => void }) {
    const Component = item.isExternal ? 'a' : Link;

    return (
        <Component href={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
        </Component>
    );
}

function MobileNavItem({ item, setIsOpen }: { item: NavItem | NavParent; setIsOpen: (isOpen: boolean) => void }) {
    return 'children' in item ? (
        <div className="flex flex-col">
            <div className="font-bold">{item.label}</div>
            <div className="ml-4 flex flex-col">
                {item.children.map((child) => (
                    <NavChild item={child} key={child.label} setIsOpen={setIsOpen} />
                ))}
            </div>
        </div>
    ) : (
        <NavChild item={item} setIsOpen={setIsOpen} />
    );
}

export default function Navbar({ currentUser }: { currentUser: typeof users.$inferSelect | null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems: (NavParent | NavItem)[] = [];

    if (process.env.NODE_ENV === 'development') {
        navItems.push({
            label: 'Debug',
            children: [
                {
                    label: 'Impersonate',
                    href: '/debug/impersonate',
                },
            ],
        });
    }

    if (currentUser) {
        navItems.push({
            label: 'Companies',
            href: '/companies',
        });
        navItems.push({
            label: currentUser.displayName,
            children: [
                {
                    label: 'Settings',
                    href: '/settings',
                },
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
                        <NavItem item={item} key={item.label} setIsOpen={setIsMenuOpen} />
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger className="flex md:hidden" asChild>
                    <Button variant="ghost">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    {navItems.map((item) => (
                        <MobileNavItem item={item} key={item.label} setIsOpen={setIsMenuOpen} />
                    ))}
                </SheetContent>
            </Sheet>
        </header>
    );
}
