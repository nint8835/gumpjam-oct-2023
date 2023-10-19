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

export function formatResourceAmount(type: ResourceType, amount: number): string {
    const resourceMeta = Resources[type];

    if (resourceMeta.amountString) {
        return resourceMeta.amountString(amount);
    }

    return amount.toLocaleString();
}
