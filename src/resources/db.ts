import db from '@/db';
import { resources } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { ResourceType, Resources } from '.';

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
        const ingredientAmounts = Object.entries(Resources[type].crafting!.ingredients).map(
            ([ingrType, ingrAmount]) => ({
                type: ingrType as ResourceType,
                amount: ingrAmount * amount,
            }),
        );

        for (const { type: ingredientType, amount: ingredientAmount } of ingredientAmounts) {
            const ingredient = await tx.query.resources.findFirst({
                where: (resources, { and, eq }) =>
                    and(eq(resources.companyId, company), eq(resources.type, ingredientType)),
            });

            if (!ingredient || ingredient.amount < ingredientAmount) {
                return `Not enough ${Resources[ingredientType].name}.`;
            }
        }

        for (const { type: ingredientType, amount: ingredientAmount } of ingredientAmounts) {
            await tx
                .update(resources)
                .set({ amount: sql`${resources.amount} - ${ingredientAmount}` })
                .where(and(eq(resources.companyId, company), eq(resources.type, ingredientType)));
        }

        const yieldAmount = Resources[type].crafting!.yield * amount;

        await tx
            .insert(resources)
            .values({ companyId: company, type, amount: yieldAmount })
            .onConflictDoUpdate({
                target: [resources.companyId, resources.type],
                set: { amount: sql`${resources.amount} + ${yieldAmount}` },
            });
        return null;
    });
}
