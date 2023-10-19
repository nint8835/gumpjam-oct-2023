import { resources as resourcesTable } from '@/db/schema';
import { Resource, ResourceType, Resources } from '.';
import { getResourceAmounts } from './utils';

export class CraftingData {
    resources: (typeof resourcesTable.$inferSelect)[];
    resourceAmounts: Record<ResourceType, number>;
    targetResource: ResourceType;

    targetResourceMeta: Resource;

    constructor(resources: (typeof resourcesTable.$inferSelect)[], targetResource: ResourceType) {
        this.resources = resources;
        this.resourceAmounts = getResourceAmounts(resources);
        this.targetResource = targetResource;
        this.targetResourceMeta = Resources[targetResource];
    }

    get maxCraftable(): number {
        return Math.min(
            ...Object.entries(this.targetResourceMeta.crafting!.ingredients).map(([resourceType, amount]) => {
                return Math.floor(this.resourceAmounts[resourceType as ResourceType] / amount);
            }),
        );
    }

    requiredIngredients(amount: number): [ResourceType, number][] {
        return Object.entries(this.targetResourceMeta.crafting!.ingredients).map(([resourceType, ingredientAmount]) => {
            return [resourceType as ResourceType, ingredientAmount * amount];
        });
    }

    yield(amount: number): number {
        return this.targetResourceMeta.crafting!.yield * amount;
    }
}
