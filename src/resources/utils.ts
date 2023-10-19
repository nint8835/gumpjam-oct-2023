import { resources as resourcesTable } from '@/db/schema';
import { ResourceType, Resources } from '.';

export function getResourceAmount(
    company: { resources: (typeof resourcesTable.$inferSelect)[] },
    type: ResourceType,
): number {
    const resource = company.resources.find((r) => r.type === type);

    return resource?.amount ?? 0;
}

export function getCompanyValue(company: { resources: (typeof resourcesTable.$inferSelect)[] }): number {
    return company.resources.reduce((acc, resource) => {
        return acc + resource.amount * Resources[resource.type].value;
    }, 0);
}

export function getResourceAmounts(resources: (typeof resourcesTable.$inferSelect)[]): Record<ResourceType, number> {
    return Object.fromEntries(
        Object.keys(Resources).map(
            (type) => [type, resources.find((r) => r.type === type)?.amount ?? 0] as [ResourceType, number],
        ),
    ) as Record<ResourceType, number>;
}

export function formatResourceAmount(type: ResourceType, amount: number): string {
    const resourceMeta = Resources[type];

    if (resourceMeta.amountString) {
        return resourceMeta.amountString(amount);
    }

    return amount.toLocaleString();
}
