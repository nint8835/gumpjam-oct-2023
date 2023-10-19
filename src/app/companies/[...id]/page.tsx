import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db';
import { ssrGetCurrentUser } from '@/lib/auth';
import { ResourceType } from '@/resources';
import { formatResourceAmount, getCompanyValue, getResourceAmount } from '@/resources/utils';
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
        .map((resourceType) => {
            return (
                company.resources.find((r) => r.type === resourceType) ?? {
                    type: resourceType,
                    companyId: company.id,
                    amount: 0,
                }
            );
        })
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
                                {formatResourceAmount(ResourceType.Money, getCompanyValue(company))}
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <div className="text-sm font-semibold text-muted-foreground">Money</div>
                            <div className="text-xl font-semibold text-accent-foreground">
                                {formatResourceAmount(
                                    ResourceType.Money,
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
                    {displayedResources.filter(({ type }) => type !== ResourceType.Money).length > 0 ? (
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
