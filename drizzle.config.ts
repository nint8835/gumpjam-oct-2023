import type { Config } from 'drizzle-kit';

export default {
    schema: './src/db/schema.ts',
    driver: 'better-sqlite',
    dbCredentials: {
        url: 'gumpjam.db',
    },
    out: './src/db/migrations',
} satisfies Config;
