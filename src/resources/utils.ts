import { resources } from '@/db/schema';
import { ResourceType } from '.';

export function getResourceAmount(
    company: { resources: (typeof resources.$inferSelect)[] },
    type: ResourceType,
): number {
    const resource = company.resources.find((r) => r.type === type);

    return resource?.amount ?? 0;
}
