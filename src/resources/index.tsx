export interface Resource {
    name: string;
    type: string;
    category: ResourceCategory;
    description: React.ReactNode;

    isManuallyProducable?: boolean;
    produceTime?: number;

    value: number;
    isSellable?: boolean;

    crafting?: {
        ingredients: {
            [type in ResourceType]?: number;
        };
        yield: number;
    };

    amountString?: (amount: number) => string;
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
        produceTime: 1,
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
            yield: 1,
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
            yield: 1,
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
            yield: 1,
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
            yield: 1,
        },
    },
};