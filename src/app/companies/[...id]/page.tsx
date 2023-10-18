import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db';
import { ssrGetCurrentUser } from '@/lib/auth';
import { ResourceType, Resources } from '@/resources';
import { getCompanyValue, getResourceAmount } from '@/resources/utils';
import { ResourceTable } from './resource_table';

export default async function CompanyPage({ params }: { params: { id: number } }) {
    const currentUser = await ssrGetCurrentUser();

    const company = await db.query.companies.findFirst({
        where: (company, { eq }) => eq(company.id, params.id),
        with: {
            resources: true,
            owner: true,
        },
    });

    if (!company) {
        return <div>Company not found.</div>;
    }

    const isOwner = currentUser !== null && company.ownerId === currentUser.id;

    const displayedResources = Object.values(ResourceType)
        .filter((resourceType) => resourceType !== ResourceType.Money)
        .map((resourceType) => ({
            type: resourceType,
            amount: getResourceAmount(company, resourceType),
        }))
        .filter(({ amount }) => amount > 0 || isOwner);

    return (
        <div className="space-y-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>{company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-1 flex-col">
                            <div className="text-sm font-semibold text-muted-foreground">Owner</div>
                            <div className="text-xl font-semibold text-accent-foreground">
                                {company.owner.displayName}
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <div className="text-sm font-semibold text-muted-foreground">Value</div>
                            <div className="text-xl font-semibold text-accent-foreground">
                                {Resources[ResourceType.Money].valueString(getCompanyValue(company))}
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <div className="text-sm font-semibold text-muted-foreground">Money</div>
                            <div className="text-xl font-semibold text-accent-foreground">
                                {Resources[ResourceType.Money].valueString(
                                    getResourceAmount(company, ResourceType.Money),
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    {displayedResources.length > 0 ? (
                        <ResourceTable resources={displayedResources} isOwner={isOwner} companyId={company.id} />
                    ) : (
                        <div className="text-center text-muted-foreground">
                            This company does not own any resources.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}