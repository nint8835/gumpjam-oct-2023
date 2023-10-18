import { resources } from '@/db/schema';
import { ResourceType, Resources } from '.';

export function getResourceAmount(
    company: { resources: (typeof resources.$inferSelect)[] },
    type: ResourceType,
): number {
    const resource = company.resources.find((r) => r.type === type);

    return resource?.amount ?? 0;
}

export function getCompanyValue(company: { resources: (typeof resources.$inferSelect)[] }): number {
    return company.resources.reduce((acc, resource) => {
        return acc + resource.amount * Resources[resource.type].value;
    }, 0);
}
