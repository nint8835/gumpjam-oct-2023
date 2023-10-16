'use server';

import db from '@/db';
import { users } from '@/db/schema';
import { SessionOptions, ssrGetCurrentUser, type SessionData } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { getServerActionIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { FieldPath } from 'react-hook-form';
import * as z from 'zod';
import { updateUserSchema } from './schema';

export async function updateUser(data: { displayName: string }): Promise<
    | {
          success: false;
          message: string;
          field: FieldPath<z.infer<typeof updateUserSchema>> | `root.${string}` | 'root';
      }
    | {
          success: true;
      }
> {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        return { field: 'root', message: 'You are not logged in.', success: false };
    }

    const validationResult = updateUserSchema.safeParse(data);
    if (!validationResult.success) {
        return { field: 'root', message: validationResult.error.message, success: false };
    }

    const existingUser = await db.query.users.findFirst({
        where: (users, { eq, ne, and }) => and(eq(users.displayName, data.displayName), ne(users.id, currentUser.id)),
    });
    if (existingUser) {
        return { field: 'displayName', message: 'Display name is already taken.', success: false };
    }

    const newUser = await db
        .update(users)
        .set({ displayName: data.displayName })
        .where(eq(users.id, currentUser.id))
        .returning();

    const session = await getServerActionIronSession<SessionData>(SessionOptions, cookies());
    session.user = newUser[0];
    await session.save();

    return { success: true };
}
