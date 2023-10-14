import { DiscordOAuthConfig } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { AuthorizationCode } from 'simple-oauth2';

export async function GET(request: NextRequest) {
    const client = new AuthorizationCode(DiscordOAuthConfig);

    redirect(
        client.authorizeURL({
            scope: 'identify',
            redirect_uri: `${request.nextUrl.origin}/auth/callback`,
            state: 'gumpjam',
        }),
    );
}
