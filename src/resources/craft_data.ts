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
            ...this.requiredIngredients(1).map(([resourceType, amount]) =>
                Math.floor(this.resourceAmounts[resourceType] / amount),
            ),
        );
    }

    requiredIngredients(amount: number): [ResourceType, number][] {
        const baseRequirements = Object.values(Resources).reduce(
            (requirements, resourceMeta) =>
                resourceMeta.mutators?.craftingCost
                    ? resourceMeta.mutators?.craftingCost(
                          structuredClone(requirements),
                          this.targetResource,
                          this.resourceAmounts,
                      )
                    : requirements,
            this.targetResourceMeta.crafting!.ingredients,
        );

        return Object.entries(baseRequirements).map(
            ([resourceType, ingredientAmount]) => [resourceType, ingredientAmount * amount] as [ResourceType, number],
        );
    }

    yield(amount: number): number {
        return (
            Object.values(Resources).reduce(
                (currentYield, resourceMeta) =>
                    resourceMeta.mutators?.craftingYield
                        ? resourceMeta.mutators?.craftingYield(
                              structuredClone(currentYield),
                              this.targetResource,
                              this.resourceAmounts,
                          )
                        : currentYield,
                this.targetResourceMeta.crafting!.yield,
            ) * amount
        );
    }
}
