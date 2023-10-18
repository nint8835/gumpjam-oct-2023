export interface Resource {
    name: string;
    type: string;

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

    valueString: (amount: number) => string;
}

export enum ResourceType {
    Money = 'money',

    TechnicalDevelopment = 'technical_development',
    HTML = 'html',
    CSS = 'css',
    JavaScript = 'javascript',
    BasicWebsite = 'basic_website',
}

export const Resources: Record<ResourceType, Resource> = {
    [ResourceType.Money]: {
        name: 'Money',
        type: ResourceType.Money,
        value: 1,
        valueString: (amount: number) => `$${amount.toLocaleString()}`,
    },

    [ResourceType.TechnicalDevelopment]: {
        name: 'Technical Development',
        type: ResourceType.TechnicalDevelopment,
        isManuallyProducable: true,
        produceTime: 1,
        isSellable: true,
        value: 1,
        valueString: (amount: number) => amount.toLocaleString(),
    },

    [ResourceType.HTML]: {
        name: 'HTML',
        type: ResourceType.HTML,
        isSellable: true,
        value: 7,
        valueString: (amount: number) => amount.toLocaleString(),
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
        isSellable: true,
        value: 7,
        valueString: (amount: number) => amount.toLocaleString(),
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
        isSellable: true,
        value: 7,
        valueString: (amount: number) => amount.toLocaleString(),
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
        isSellable: true,
        value: 1,
        valueString: (amount: number) => amount.toLocaleString(),
        crafting: {
            ingredients: {
                [ResourceType.HTML]: 3,
                [ResourceType.CSS]: 3,
            },
            yield: 1,
        },
    },
};
