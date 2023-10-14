import { SessionData, SessionOptions } from '@/lib/auth';
import { getIronSession } from 'iron-session';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const response = new Response(null, {
        status: 302,
    });
    response.headers.set('Location', request.nextUrl.origin);

    const session = await getIronSession<SessionData>(request, response, SessionOptions);
    session.user = undefined;
    await session.save();

    return response;
}
