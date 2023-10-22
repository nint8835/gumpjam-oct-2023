import * as z from 'zod';

export const createCompanySchema = z.object({
    name: z.string().min(1, { message: 'Company name must be at least 1 character.' }),
});
