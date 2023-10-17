import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import db from '@/db';
import { ssrGetCurrentUser } from '@/lib/auth';

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
                            <div className="text-sm font-semibold text-muted-foreground">Money</div>
                            <div className="text-xl font-semibold text-accent-foreground">${company.money}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    {company.resources.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Resource</TableHead>
                                    <TableHead>Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {company.resources.map((resource) => (
                                    <TableRow key={resource.type}>
                                        <TableCell>{resource.type}</TableCell>
                                        <TableCell>{resource.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div>This company does not own any resources.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
