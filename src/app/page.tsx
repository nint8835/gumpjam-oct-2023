'use server';

import { ssrGetCurrentUser } from '@/lib/auth';

export default async function HomePage() {
    const user = await ssrGetCurrentUser();
    return <div>{JSON.stringify(user)}</div>;
}
