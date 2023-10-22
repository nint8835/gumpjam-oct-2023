import { z } from 'zod';

export const impersonateSchema = z.object({
    id: z.string({ required_error: 'Please select a user to impersonate.' }),
});
