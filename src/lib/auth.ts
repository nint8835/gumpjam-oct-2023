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
