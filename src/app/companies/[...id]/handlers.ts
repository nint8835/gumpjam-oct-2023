'use server';

import db from '@/db';
import { ssrGetCurrentUser } from '@/lib/auth';
import { ResourceType, Resources } from '@/resources';
import { addResource, craftResource as craftResourceUtil, sellResource as sellResourceUtil } from '@/resources/db';
import { getResourceAmounts } from '@/resources/utils';
import { revalidatePath } from 'next/cache';

export async function produceResource(
    resourceType: ResourceType,
    companyId: number,
): Promise<{ success: boolean; message?: string }> {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        return { success: false, message: 'You are not logged in.' };
    }

    const company = await db.query.companies.findFirst({
        where: (companies, { eq }) => eq(companies.id, companyId),
        with: {
            resources: true,
        },
    });

    if (!company) {
        return { success: false, message: 'Company not found.' };
    }

    if (company.ownerId !== currentUser.id) {
        return { success: false, message: 'You do not own this company.' };
    }

    if (!Resources[resourceType].isManuallyProducable) {
        return { success: false, message: 'This resource cannot be manually produced.' };
    }

    const resourceAmounts = getResourceAmounts(company.resources);

    const productionYield = Object.values(Resources)
        .filter((resourceMeta) => resourceMeta.mutators?.productionYield !== undefined)
        .sort((a, b) => a.mutators?.priority! - b.mutators?.priority!)
        .reduce(
            (currentYield, resourceMeta) =>
                resourceMeta.mutators!.productionYield!(currentYield, resourceType, resourceAmounts),
            1,
        );

    await addResource({
        company: companyId,
        type: resourceType,
        amount: productionYield,
    });

    revalidatePath(`/companies/${companyId}`);

    return { success: true };
}

export async function sellResource({
    resourceType,
    amount,
    companyId,
}: {
    resourceType: ResourceType;
    amount: number;
    companyId: number;
}): Promise<{ success: boolean; message?: string }> {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        return { success: false, message: 'You are not logged in.' };
    }

    const company = await db.query.companies.findFirst({
        where: (companies, { eq }) => eq(companies.id, companyId),
    });

    if (!company) {
        return { success: false, message: 'Company not found.' };
    }

    if (company.ownerId !== currentUser.id) {
        return { success: false, message: 'You do not own this company.' };
    }

    if (!Resources[resourceType].isSellable) {
        return { success: false, message: 'This resource cannot be sold.' };
    }

    const failureMessage = await sellResourceUtil({
        company: companyId,
        type: resourceType,
        amount,
    });

    if (failureMessage) {
        return { success: false, message: failureMessage };
    }

    revalidatePath(`/companies/${companyId}`);

    return { success: true };
}

export async function craftResource({
    resourceType,
    amount,
    companyId,
}: {
    resourceType: ResourceType;
    amount: number;
    companyId: number;
}): Promise<{ success: boolean; message?: string }> {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        return { success: false, message: 'You are not logged in.' };
    }

    const company = await db.query.companies.findFirst({
        where: (companies, { eq }) => eq(companies.id, companyId),
    });

    if (!company) {
        return { success: false, message: 'Company not found.' };
    }

    if (company.ownerId !== currentUser.id) {
        return { success: false, message: 'You do not own this company.' };
    }

    if (!Resources[resourceType].crafting) {
        return { success: false, message: 'This resource cannot be crafted.' };
    }

    const failureMessage = await craftResourceUtil({
        company: companyId,
        type: resourceType,
        amount,
    });

    if (failureMessage) {
        return { success: false, message: failureMessage };
    }

    revalidatePath(`/companies/${companyId}`);

    return { success: true };
}
