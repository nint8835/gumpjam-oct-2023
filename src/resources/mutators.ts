import { ResourceType, type CraftingMutator } from '.';

export function contractMutator({
    contractType,
    affectedResource,
    ingredientCost,
}: {
    contractType: ResourceType;
    affectedResource: ResourceType;
    ingredientCost: number;
}): CraftingMutator {
    return (currentValues, target, resources) => {
        if (resources[contractType] === 0) {
            return currentValues;
        }

        if (!(affectedResource in currentValues.ingredients)) {
            return currentValues;
        }

        currentValues.ingredients[ResourceType.Money] =
            (currentValues.ingredients[ResourceType.Money] ?? 0) +
            ingredientCost * currentValues.ingredients[affectedResource]!;
        delete currentValues.ingredients[affectedResource];

        currentValues.ingredients[contractType] = 1;
        currentValues.yield[contractType] = 1;

        return currentValues;
    };
}
