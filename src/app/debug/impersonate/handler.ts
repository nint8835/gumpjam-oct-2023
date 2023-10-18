'use server';

import db from '@/db';
import { SessionData, SessionOptions } from '@/lib/auth';
import { getServerActionIronSession } from 'iron-session';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { FieldPath } from 'react-hook-form';
import * as z from 'zod';
import { impersonateSchema } from './schema';

export async function impersonateUser(data: { id: string }): Promise<
    | {
          success: false;
          message: string;
          field: FieldPath<z.infer<typeof impersonateSchema>> | `root.${string}` | 'root';
      }
    | {
          success: true;
      }
> {
    if (process.env.NODE_ENV !== 'development') {
        return { success: false, message: 'This feature is only available in development.', field: 'root' };
    }

    const validationResult = impersonateSchema.safeParse(data);
    if (!validationResult.success) {
        return { field: 'root', message: validationResult.error.message, success: false };
    }

    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, data.id),
    });
    if (!user) {
        return { field: 'id', message: 'User not found.', success: false };
    }

    const session = await getServerActionIronSession<SessionData>(SessionOptions, cookies());
    session.user = user.id;
    await session.save();

    revalidatePath('/');

    return { success: true };
}
