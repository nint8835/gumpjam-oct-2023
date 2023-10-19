export interface Resource {
    name: string;
    type: string;
    category: ResourceCategory;

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
        value: 1,
        amountString: (amount: number) => `$${amount.toLocaleString()}`,
    },

    [ResourceType.TechnicalDevelopment]: {
        name: 'Technical Development',
        type: ResourceType.TechnicalDevelopment,
        category: ResourceCategory.Tech,
        isManuallyProducable: true,
        produceTime: 1,
        isSellable: true,
        value: 1,
    },

    [ResourceType.HTML]: {
        name: 'HTML',
        type: ResourceType.HTML,
        category: ResourceCategory.Tech,
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
