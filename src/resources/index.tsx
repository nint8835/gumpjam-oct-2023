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

    TechnicalDevelopment = 'technical_development',
    HTML = 'html',
    CSS = 'css',
    JavaScript = 'javascript',
    BasicWebsite = 'basic_website',
}

export enum ResourceCategory {
    Core = 'Core',
    Tech = 'Tech',
}

export const Resources: Record<ResourceType, Resource> = {
    [ResourceType.Money]: {
        name: 'Money',
        type: ResourceType.Money,
        category: ResourceCategory.Core,
        description: 'The currency of the game.',
        value: 1,
        amountString: (amount: number) => `$${amount.toLocaleString()}`,
    },

    [ResourceType.TechnicalDevelopment]: {
        name: 'Technical Development',
        type: ResourceType.TechnicalDevelopment,
        category: ResourceCategory.Tech,
        description: 'Base resource for all tech-based resources.',
        isManuallyProducable: true,
        isSellable: true,
        value: 1,
    },

    [ResourceType.HTML]: {
        name: 'HTML',
        type: ResourceType.HTML,
        category: ResourceCategory.Tech,
        description: 'HTML code.',
        isSellable: true,
        value: 7,
        crafting: {
            ingredients: {
                [ResourceType.TechnicalDevelopment]: 5,
            },
            yield: {
                [ResourceType.HTML]: 1,
            },
        },
    },
    [ResourceType.CSS]: {
        name: 'CSS',
        type: ResourceType.CSS,
        category: ResourceCategory.Tech,
        description: 'CSS code.',
        isSellable: true,
        value: 7,
        crafting: {
            ingredients: {
                [ResourceType.TechnicalDevelopment]: 5,
            },
            yield: {
                [ResourceType.CSS]: 1,
            },
        },
    },
    [ResourceType.JavaScript]: {
        name: 'JavaScript',
        type: ResourceType.JavaScript,
        category: ResourceCategory.Tech,
        description: 'JavaScript code.',
        isSellable: true,
        value: 7,
        crafting: {
            ingredients: {
                [ResourceType.TechnicalDevelopment]: 5,
            },
            yield: {
                [ResourceType.JavaScript]: 1,
            },
        },
    },
    [ResourceType.BasicWebsite]: {
        name: 'Basic Website',
        type: ResourceType.BasicWebsite,
        category: ResourceCategory.Tech,
        description: 'A basic, static website.',
        isSellable: true,
        value: 75,
        crafting: {
            ingredients: {
                [ResourceType.HTML]: 3,
                [ResourceType.CSS]: 3,
            },
            yield: {
                [ResourceType.BasicWebsite]: 1,
            },
        },
    },
};
