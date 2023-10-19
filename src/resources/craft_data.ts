import { resources as resourcesTable } from '@/db/schema';
import { Resource, ResourceType, Resources } from '.';

export class CraftingData {
    resources: (typeof resourcesTable.$inferSelect)[];
    targetResource: ResourceType;

    targetResourceMeta: Resource;

    constructor(resources: (typeof resourcesTable.$inferSelect)[], targetResource: ResourceType) {
        this.resources = resources;
        this.targetResource = targetResource;
        this.targetResourceMeta = Resources[targetResource];
    }

    get maxCraftable(): number {
        return Math.min(
            ...Object.entries(this.targetResourceMeta.crafting!.ingredients).map(([resourceType, amount]) => {
                const resourceCount =
                    this.resources.find((r) => r.type === (resourceType as ResourceType))?.amount ?? 0;

                return Math.floor(resourceCount / amount);
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
