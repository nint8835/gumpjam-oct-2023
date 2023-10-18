import db from '@/db';
import { resources } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { ResourceType } from '.';

export async function ssrGetResourceAmount(company: number, type: ResourceType): Promise<number> {
    const resource = await db.query.resources.findFirst({
        where: (resources, { and, eq }) => and(eq(resources.companyId, company), eq(resources.type, type)),
    });

    return resource?.amount ?? 0;
}

export async function addResource({
    company,
    type,
    amount,
}: {
    company: number;
    type: ResourceType;
    amount: number;
}): Promise<void> {
    await db
        .insert(resources)
        .values({
            companyId: company,
            type,
            amount,
        })
        .onConflictDoUpdate({
            target: [resources.companyId, resources.type],
            set: { amount: sql`${resources.amount} + ${amount}` },
        });
}
