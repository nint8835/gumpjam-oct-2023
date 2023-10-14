import { DiscordOAuthConfig } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AuthorizationCode } from 'simple-oauth2';

export async function GET(request: Request) {
    const client = new AuthorizationCode(DiscordOAuthConfig);

    redirect(
        client.authorizeURL({
            scope: 'identify',
            redirect_uri: `${new URL(request.url).origin}/auth/callback`,
            state: 'gumpjam',
        }),
    );
}
