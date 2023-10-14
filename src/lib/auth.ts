import { users } from '@/db/schema';
import { getServerActionIronSession, type IronSessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import type { ModuleOptions } from 'simple-oauth2';

export const DiscordOAuthConfig: ModuleOptions<'client_id'> = {
    client: {
        id: process.env.DISCORD_CLIENT_ID!,
        secret: process.env.DISCORD_CLIENT_SECRET!,
    },
    auth: {
        tokenHost: 'https://discord.com',
        authorizePath: '/oauth2/authorize',
        tokenPath: '/api/oauth2/token',
    },
};

export const SessionOptions: IronSessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: 'gumpjam_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export type SessionUser = typeof users.$inferSelect;

export type SessionData = {
    user?: SessionUser;
};

export async function ssrGetCurrentUser(): Promise<null | SessionUser> {
    const session = await getServerActionIronSession<SessionData>(SessionOptions, cookies());
    return session.user ?? null;
}
