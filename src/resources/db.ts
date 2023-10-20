import db from '@/db';
import { resources } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { ResourceType, Resources } from '.';
import { CraftingData } from './craft_data';

export async function ssrGetResourceAmount(company: number, type: ResourceType): Promise<number> {
    const resource = await db.query.resources.findFirst({
        where: (resources, { and, eq }) => and(eq(resources.companyId, company), eq(resources.type, type)),
    });

    return resource?.amount ?? 0;
}

export async function addResource({
    company,
    type,
    amount,
}: {
    company: number;
    type: ResourceType;
    amount: number;
}): Promise<void> {
    await db
        .insert(resources)
        .values({
            companyId: company,
            type,
            amount,
        })
        .onConflictDoUpdate({
            target: [resources.companyId, resources.type],
            set: { amount: sql`${resources.amount} + ${amount}` },
        });
}

export async function sellResource({
    company,
    type,
    amount,
}: {
    company: number;
    type: ResourceType;
    amount: number;
}): Promise<null | string> {
    return await db.transaction(async (tx) => {
        const resource = await tx.query.resources.findFirst({
            where: (resources, { and, eq }) => and(eq(resources.companyId, company), eq(resources.type, type)),
        });

        if (!resource || resource.amount < amount) {
            return 'Not enough resources.';
        }

        const sellValue = Resources[type].value * amount;

        await tx
            .update(resources)
            .set({ amount: sql`${resources.amount} - ${amount}` })
            .where(and(eq(resources.companyId, company), eq(resources.type, type)));
        await tx
            .insert(resources)
            .values({ companyId: company, type: ResourceType.Money, amount: sellValue })
            .onConflictDoUpdate({
                target: [resources.companyId, resources.type],
                set: { amount: sql`${resources.amount} + ${sellValue}` },
            });

        return null;
    });
}

export async function craftResource({
    company,
    type,
    amount,
}: {
    company: number;
    type: ResourceType;
    amount: number;
}): Promise<null | string> {
    return await db.transaction(async (tx) => {
        const companyResources = await tx.query.resources.findMany({
            where: (resources, { eq }) => eq(resources.companyId, company),
        });

        const craftingData = new CraftingData(companyResources, type);
        const ingredientAmounts = craftingData.requiredIngredients(amount);

        for (const [ingredientType, ingredientAmount] of ingredientAmounts) {
            const ingredient = await tx.query.resources.findFirst({
                where: (resources, { and, eq }) =>
                    and(eq(resources.companyId, company), eq(resources.type, ingredientType)),
            });

            if (!ingredient || ingredient.amount < ingredientAmount) {
                return `Not enough ${Resources[ingredientType].name}.`;
            }
        }

        for (const [ingredientType, ingredientAmount] of ingredientAmounts) {
            await tx
                .update(resources)
                .set({ amount: sql`${resources.amount} - ${ingredientAmount}` })
                .where(and(eq(resources.companyId, company), eq(resources.type, ingredientType)));
        }

        const yieldAmounts = craftingData.yield(amount);

        for (const [yieldType, yieldAmount] of yieldAmounts) {
            await tx
                .insert(resources)
                .values({ companyId: company, type: yieldType, amount: yieldAmount })
                .onConflictDoUpdate({
                    target: [resources.companyId, resources.type],
                    set: { amount: sql`${resources.amount} + ${yieldAmount}` },
                });
        }
        return null;
    });
}
