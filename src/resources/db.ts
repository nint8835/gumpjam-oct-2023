import db from '@/db';
import { ResourceType } from '.';

export async function ssrGetResourceAmount(company: number, type: ResourceType): Promise<number> {
    const resource = await db.query.resources.findFirst({
        where: (resources, { and, eq }) => and(eq(resources.companyId, company), eq(resources.type, type)),
    });

    return resource?.amount ?? 0;
}
