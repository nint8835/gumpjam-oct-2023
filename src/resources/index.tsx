export type PartialResourceMap = {
    [type in ResourceType]?: number;
};

export interface Resource {
    name: string;
    type: ResourceType;
    category: ResourceCategory;
    description: React.ReactNode;

    isManuallyProducable?: boolean;

    value: number;
    isSellable?: boolean;

    crafting?: {
        forbidMultiCraft?: boolean;

        ingredients: PartialResourceMap;
        yield: PartialResourceMap;
    };

    amountString?: (amount: number) => string;

    mutators?: {
        priority: number;

        crafting?: (
            currentValues: {
                ingredients: PartialResourceMap;
                yield: PartialResourceMap;
            },
            target: ResourceType,
            resources: Record<ResourceType, number>,
        ) => {
            ingredients: PartialResourceMap;
            yield: PartialResourceMap;
        };

        productionYield?: (
            currentYield: number,
            target: ResourceType,
            resources: Record<ResourceType, number>,
        ) => number;
    };
}

export enum ResourceType {
    Money = 'money',
}

export enum ResourceCategory {
    Core = 'Core',
}

export const ResourceCategoryOrder: ResourceCategory[] = [ResourceCategory.Core];

export const Resources: Record<ResourceType, Resource> = {
    [ResourceType.Money]: {
        name: 'Money',
        type: ResourceType.Money,
        category: ResourceCategory.Core,
        description: 'The currency of the game.',
        value: 1,
        amountString: (amount: number) => `$${amount.toLocaleString()}`,
    },
};
