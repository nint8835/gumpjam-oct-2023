import { resources as resourcesTable } from '@/db/schema';
import { PartialResourceMap, Resource, ResourceType, Resources } from '.';
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
            ...this.requiredIngredients(1).map(([resourceType, amount]) =>
                Math.floor(this.resourceAmounts[resourceType] / amount),
            ),
        );
    }

    private mutatedCraftingDetails(): {
        ingredients: PartialResourceMap;
        yield: PartialResourceMap;
    } {
        return Object.values(Resources)
            .filter((resourceMeta) => resourceMeta.mutators?.crafting !== undefined)
            .sort((a, b) => a.mutators?.priority! - b.mutators?.priority!)
            .reduce(
                (currentAmounts, resourceMeta) =>
                    resourceMeta.mutators!.crafting!(
                        structuredClone(currentAmounts),
                        this.targetResource,
                        this.resourceAmounts,
                    ),
                {
                    ingredients: this.targetResourceMeta.crafting!.ingredients,
                    yield: this.targetResourceMeta.crafting!.yield,
                },
            );
    }

    requiredIngredients(amount: number): [ResourceType, number][] {
        return Object.entries(this.mutatedCraftingDetails().ingredients).map(
            ([resourceType, ingredientAmount]) => [resourceType, ingredientAmount * amount] as [ResourceType, number],
        );
    }

    yield(amount: number): [ResourceType, number][] {
        return Object.entries(this.mutatedCraftingDetails().yield).map(
            ([resourceType, yieldAmount]) => [resourceType, yieldAmount * amount] as [ResourceType, number],
        );
    }
}
