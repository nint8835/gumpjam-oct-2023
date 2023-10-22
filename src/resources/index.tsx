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
    Rock = 'rock',
    Sand = 'sand',

    // Machinery
    Sawmill = 'sawmill',
    Smelter = 'smelter',
    Stonecutter = 'stonecutter',
    ArcFurnace = 'arc-furnace',

    // Refined Resources
    Lumber = 'lumber',
    Metal = 'metal',
    Stone = 'stone',
    Charcoal = 'charcoal',
    Steel = 'steel',
    Wire = 'wire',
    Coke = 'coke',
    Silicon = 'silicon',
    Glass = 'glass',

    // Supply Contracts
    WoodContract = 'wood-contract',
    OreContract = 'ore-contract',
    RockContract = 'rock-contract',
    SandContract = 'sand-contract',
    LumberContract = 'lumber-contract',
    MetalContract = 'metal-contract',
    StoneContract = 'stone-contract',
    CharcoalContract = 'charcoal-contract',
    SteelContract = 'steel-contract',
    WireContract = 'wire-contract',
    CokeContract = 'coke-contract',
    SiliconContract = 'silicon-contract',
    GlassContract = 'glass-contract',
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
        description: 'A chunk of raw metal.',
        value: 5,
        isManuallyProducable: true,
        isSellable: true,
    },
    [ResourceType.Rock]: {
        name: 'Rock',
        type: ResourceType.Rock,
        category: ResourceCategory.NaturalResources,
        description: 'A chunk of raw stone.',
        value: 5,
        isManuallyProducable: true,
        isSellable: true,
    },
    [ResourceType.Sand]: {
        name: 'Sand',
        type: ResourceType.Sand,
        category: ResourceCategory.NaturalResources,
        description: 'A pile of sand.',
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
                Enables processing of <span className="text-accent-foreground">Wood</span> into{' '}
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
                Enables processing of <span className="text-accent-foreground">Ore</span> into{' '}
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
    [ResourceType.Stonecutter]: {
        name: 'Stonecutter',
        type: ResourceType.Stonecutter,
        category: ResourceCategory.Machinery,
        description: (
            <span>
                Enables processing of <span className="text-accent-foreground">Rock</span> into{' '}
                <span className="text-accent-foreground">Stone</span>.
            </span>
        ),
        value: 75,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.Stonecutter]: 1,
            },
        },
    },
    [ResourceType.ArcFurnace]: {
        name: 'Arc Furnace',
        type: ResourceType.ArcFurnace,
        category: ResourceCategory.Machinery,
        description: (
            <span>
                Enables processing of <span className="text-accent-foreground">Charcoal</span> and{' '}
                <span className="text-accent-foreground">Metal</span> into{' '}
                <span className="text-accent-foreground">Steel</span>.
            </span>
        ),
        value: 150,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Stone]: 100,
                [ResourceType.Wire]: 50,
            },
            yield: {
                [ResourceType.ArcFurnace]: 1,
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
    [ResourceType.Stone]: {
        name: 'Stone',
        type: ResourceType.Stone,
        category: ResourceCategory.RefinedResources,
        description: 'A slab of processed stone.',
        value: 10,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Rock]: 1,
                [ResourceType.Stonecutter]: 1,
            },
            yield: {
                [ResourceType.Stone]: 5,
                [ResourceType.Stonecutter]: 1,
            },
        },
    },
    [ResourceType.Charcoal]: {
        name: 'Charcoal',
        type: ResourceType.Charcoal,
        category: ResourceCategory.RefinedResources,
        description: 'A chunk of carbonized wood.',
        value: 10,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Wood]: 1,
                [ResourceType.Smelter]: 1,
            },
            yield: {
                [ResourceType.Charcoal]: 5,
                [ResourceType.Smelter]: 1,
            },
        },
    },
    [ResourceType.Steel]: {
        name: 'Steel',
        type: ResourceType.Steel,
        category: ResourceCategory.RefinedResources,
        description: 'A bar of processed metal.',
        value: 10,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Metal]: 1,
                [ResourceType.Charcoal]: 1,
                [ResourceType.ArcFurnace]: 1,
            },
            yield: {
                [ResourceType.Steel]: 5,
                [ResourceType.Charcoal]: 1,
                [ResourceType.ArcFurnace]: 1,
            },
        },
    },
    [ResourceType.Wire]: {
        name: 'Wire',
        type: ResourceType.Wire,
        category: ResourceCategory.RefinedResources,
        description: 'A spool of wire.',
        value: 10,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Metal]: 1,
                [ResourceType.Smelter]: 1,
            },
            yield: {
                [ResourceType.Wire]: 5,
                [ResourceType.Smelter]: 1,
            },
        },
    },
    [ResourceType.Coke]: {
        name: 'Coke',
        type: ResourceType.Coke,
        category: ResourceCategory.RefinedResources,
        description: 'A chunk of carbonized coal.',
        value: 25,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Charcoal]: 1,
                [ResourceType.Smelter]: 1,
            },
            yield: {
                [ResourceType.Coke]: 1,
                [ResourceType.Smelter]: 1,
            },
        },
    },
    [ResourceType.Silicon]: {
        name: 'Silicon',
        type: ResourceType.Silicon,
        category: ResourceCategory.RefinedResources,
        description: 'A chunk of silicon.',
        value: 25,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Sand]: 1,
                [ResourceType.Coke]: 1,
                [ResourceType.Smelter]: 1,
            },
            yield: {
                [ResourceType.Silicon]: 1,
                [ResourceType.Smelter]: 1,
            },
        },
    },
    [ResourceType.Glass]: {
        name: 'Glass',
        type: ResourceType.Glass,
        category: ResourceCategory.RefinedResources,
        description: 'A sheet of glass.',
        value: 25,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Sand]: 1,
                [ResourceType.Smelter]: 1,
            },
            yield: {
                [ResourceType.Glass]: 1,
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
    [ResourceType.RockContract]: {
        name: 'Rock Contract',
        type: ResourceType.RockContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Rock</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.RockContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Rock,
                contractType: ResourceType.RockContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.SandContract]: {
        name: 'Sand Contract',
        type: ResourceType.SandContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Sand</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.SandContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Sand,
                contractType: ResourceType.SandContract,
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
    [ResourceType.StoneContract]: {
        name: 'Stone Contract',
        type: ResourceType.StoneContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Stone</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.StoneContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Stone,
                contractType: ResourceType.StoneContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.CharcoalContract]: {
        name: 'Charcoal Contract',
        type: ResourceType.CharcoalContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Charcoal</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.CharcoalContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Charcoal,
                contractType: ResourceType.CharcoalContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.SteelContract]: {
        name: 'Steel Contract',
        type: ResourceType.SteelContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Steel</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.SteelContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Steel,
                contractType: ResourceType.SteelContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.WireContract]: {
        name: 'Wire Contract',
        type: ResourceType.WireContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Wire</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.WireContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Wire,
                contractType: ResourceType.WireContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.CokeContract]: {
        name: 'Coke Contract',
        type: ResourceType.CokeContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Coke</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.CokeContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Coke,
                contractType: ResourceType.CokeContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.SiliconContract]: {
        name: 'Silicon Contract',
        type: ResourceType.SiliconContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Silicon</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.SiliconContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Silicon,
                contractType: ResourceType.SiliconContract,
                ingredientCost: 10,
            }),
        },
    },
    [ResourceType.GlassContract]: {
        name: 'Glass Contract',
        type: ResourceType.GlassContract,
        category: ResourceCategory.SupplyContracts,
        description: (
            <span>
                A contract to supply <span className="text-accent-foreground">Glass</span>.
            </span>
        ),
        value: 100,
        isSellable: true,
        crafting: {
            ingredients: {
                [ResourceType.Money]: 100,
            },
            yield: {
                [ResourceType.GlassContract]: 1,
            },
        },

        mutators: {
            priority: 100,

            crafting: contractMutator({
                affectedResource: ResourceType.Glass,
                contractType: ResourceType.GlassContract,
                ingredientCost: 10,
            }),
        },
    },
};
