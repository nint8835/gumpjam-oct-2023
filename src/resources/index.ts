export interface Resource {
    name: string;
    type: string;

    isManuallyProducable?: boolean;
    produceTime?: number;

    value: number;
    isSellable?: boolean;

    valueString: (amount: number) => string;
}

export enum ResourceType {
    Money = 'money',

    TechnicalInnovation = 'technical_innovation',
}

export const Resources: Record<ResourceType, Resource> = {
    [ResourceType.Money]: {
        name: 'Money',
        type: ResourceType.Money,
        value: 1,
        valueString: (amount: number) => `$${amount}`,
    },

    [ResourceType.TechnicalInnovation]: {
        name: 'Technical Innovation',
        type: ResourceType.TechnicalInnovation,
        isManuallyProducable: true,
        produceTime: 1,
        isSellable: true,
        value: 5,
        valueString: (amount: number) => amount.toString(),
    },
};
