import { DiscordOAuthConfig } from '@/lib/auth';
import { AuthorizationCode } from 'simple-oauth2';

export async function GET(request: Request) {
    const parsedUrl = new URL(request.url);
    const code = parsedUrl.searchParams.get('code');
    const state = parsedUrl.searchParams.get('state');

    if (!code || !state || state !== 'gumpjam') {
        return new Response('Invalid request', { status: 400 });
    }

    const client = new AuthorizationCode(DiscordOAuthConfig);

    const tokenParams = {
        code,
        scope: 'identify',
        redirect_uri: `${parsedUrl.origin}/auth/callback`,
    };
    const accessToken = await client.getToken(tokenParams);

    const userReq = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            Authorization: `Bearer ${accessToken.token.access_token}`,
        },
    });

    const user = await userReq.json();

    return new Response(JSON.stringify(user), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
