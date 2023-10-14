import db from '@/db';
import { users } from '@/db/schema';
import { DiscordOAuthConfig, SessionData, SessionOptions } from '@/lib/auth';
import { getIronSession } from 'iron-session';
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
    const userData = await userReq.json();

    let user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userData.id),
    });

    if (!user) {
        user = (
            await db
                .insert(users)
                .values({
                    id: userData.id,
                    displayName: userData.global_name || userData.username,
                })
                .returning()
        )[0];
    }

    const response = new Response(null, {
        status: 302,
    });
    response.headers.set('Location', parsedUrl.origin);

    const session = await getIronSession<SessionData>(request, response, SessionOptions);
    session.user = user;
    await session.save();

    return response;
}
