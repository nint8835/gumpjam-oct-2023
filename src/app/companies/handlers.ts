'use server';

import db from '@/db';
import { companies } from '@/db/schema';
import { ssrGetCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { FieldPath } from 'react-hook-form';
import * as z from 'zod';
import { createCompanySchema } from './schema';

export async function createCompany(data: { name: string }): Promise<
    | {
          success: false;
          message: string;
          field: FieldPath<z.infer<typeof createCompanySchema>> | `root.${string}` | 'root';
      }
    | {
          success: true;
      }
> {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        return { field: 'root', message: 'You are not logged in.', success: false };
    }

    const validationResult = createCompanySchema.safeParse(data);
    if (!validationResult.success) {
        return { field: 'root', message: validationResult.error.message, success: false };
    }

    const existingCompany = await db.query.companies.findFirst({
        where: (companies, { eq }) => eq(companies.name, data.name),
    });
    if (existingCompany) {
        return { field: 'name', message: 'A company with this name already exists.', success: false };
    }

    await db
        .insert(companies)
        .values({
            name: data.name,
            founderId: currentUser.id,
        })
        .execute();

    revalidatePath('/companies');

    return { success: true };
}
