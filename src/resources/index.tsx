import { contractMutator } from './mutators';

export type PartialResourceMap = {
    [type in ResourceType]?: number;
};

export type CraftingMutator = (
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

export type ProductionYieldMutator = (
    currentYield: number,
    target: ResourceType,
    resources: Record<ResourceType, number>,
) => number;

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

        crafting?: CraftingMutator;

        productionYield?: ProductionYieldMutator;
    };
}

export enum ResourceCategory {
    Core = 'Core',

    NaturalResources = 'Natural Resources',
    Machinery = 'Machinery',
    RefinedResources = 'Refined Resources',
    SupplyContracts = 'Supply Contracts',
}

export const ResourceCategoryOrder: ResourceCategory[] = [
    ResourceCategory.Core,
    ResourceCategory.NaturalResources,
    ResourceCategory.Machinery,
    ResourceCategory.RefinedResources,
    ResourceCategory.SupplyContracts,
];

export const ResourceCategoryDescriptions: Record<ResourceCategory, React.ReactNode> = {
    [ResourceCategory.Core]: 'The core resources of the game.',
    [ResourceCategory.NaturalResources]: 'Raw, unprocessed resources.',
    [ResourceCategory.Machinery]: 'Machinery used to process resources.',
    [ResourceCategory.RefinedResources]: 'Processed resources.',
    [ResourceCategory.SupplyContracts]: (
        <span>
            Contracts to supply resources. Substitutes the associated resource in crafting costs with{' '}
            <span className="text-accent-foreground">Money</span>.
        </span>
    ),
};

export enum ResourceType {
    // Core
    Money = 'money',

    // Natural Resources
    Wood = 'wood',
    Ore = 'ore',

    // Machinery
    Sawmill = 'sawmill',
    Smelter = 'smelter',

    // Refined Resources
    Lumber = 'lumber',
    Metal = 'metal',

    // Supply Contracts
    WoodContract = 'wood-contract',
    OreContract = 'ore-contract',
    LumberContract = 'lumber-contract',
    MetalContract = 'metal-contract',
}

export const Resources: Record<ResourceType, Resource> = {
    // Core
    [ResourceType.Money]: {
        name: 'Money',
        type: ResourceType.Money,
        category: ResourceCategory.Core,
        description: 'The currency of the game.',
        value: 1,
        amountString: (amount: number) => `$${amount.toLocaleString()}`,
    },

    // Natural Resources
    [ResourceType.Wood]: {
        name: 'Wood',
        type: ResourceType.Wood,
        category: ResourceCategory.NaturalResources,
        description: 'A log of raw wood.',
        value: 5,
        isManuallyProducable: true,
        isSellable: true,
    },
    [ResourceType.Ore]: {
        name: 'Ore',
        type: ResourceType.Ore,
        category: ResourceCategory.NaturalResources,
        description: 'A chunk of raw, unprocessed metal.',
        value: 5,
        isManuallyProducable: true,
        isSellable: true,
    },

    // Machinery
    [ResourceType.Sawmill]: {
        name: 'Sawmill',
        type: ResourceType.Sawmill,
        category: ResourceCategory.Machinery,
        description: (
            <span>
                A sawmill. Enables processing of <span className="text-accent-foreground">Wood</span> into{' '}
                <span className="text-accent-foreground">Lumber</span>.
            </span>
        ),
        value: 75,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.Sawmill]: 1,
            },
        },
    },
    [ResourceType.Smelter]: {
        name: 'Smelter',
        type: ResourceType.Smelter,
        category: ResourceCategory.Machinery,
        description: (
            <span>
                A smelter. Enables processing of <span className="text-accent-foreground">Ore</span> into{' '}
                <span className="text-accent-foreground">Metal</span>.
            </span>
        ),
        value: 75,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.Smelter]: 1,
            },
        },
    },

    // Refined Resources
    [ResourceType.Lumber]: {
        name: 'Lumber',
        type: ResourceType.Lumber,
        category: ResourceCategory.RefinedResources,
        description: 'A plank of processed wood.',
        value: 10,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Wood]: 1,
                [ResourceType.Sawmill]: 1,
            },
            yield: {
                [ResourceType.Lumber]: 5,
                [ResourceType.Sawmill]: 1,
            },
        },
    },
    [ResourceType.Metal]: {
        name: 'Metal',
        type: ResourceType.Metal,
        category: ResourceCategory.RefinedResources,
        description: 'A bar of processed metal.',
        value: 10,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Ore]: 1,
                [ResourceType.Smelter]: 1,
            },
            yield: {
                [ResourceType.Metal]: 5,
                [ResourceType.Smelter]: 1,
            },
        },
    },

    // Supply Contracts
    [ResourceType.WoodContract]: {
        name: 'Wood Contract',
        type: ResourceType.WoodContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Wood</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.WoodContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Wood,
                contractType: ResourceType.WoodContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.OreContract]: {
        name: 'Ore Contract',
        type: ResourceType.OreContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Ore</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.OreContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Ore,
                contractType: ResourceType.OreContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.LumberContract]: {
        name: 'Lumber Contract',
        type: ResourceType.LumberContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Lumber</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.LumberContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Lumber,
                contractType: ResourceType.LumberContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.MetalContract]: {
        name: 'Metal Contract',
        type: ResourceType.MetalContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Metal</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.MetalContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Metal,
                contractType: ResourceType.MetalContract,
                ingredientCost: 10,
            }),
        },
    },
};
