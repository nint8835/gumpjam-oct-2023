export interface Resource {
    name: string;
    type: string;

    valueString: (amount: number) => string;
}

export enum ResourceType {
    Money = 'money',
}

export const Resources: Record<ResourceType, Resource> = {
    [ResourceType.Money]: {
        name: 'Money',
        type: ResourceType.Money,
        valueString: (amount: number) => `$${amount}`,
    },
};
