import * as z from 'zod';

export const updateUserSchema = z.object({
    displayName: z.string().min(2, { message: 'Display name must be at least 1 character.' }),
});
