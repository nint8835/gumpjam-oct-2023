import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db';
import { ssrGetCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CompanyTable } from './company_table';
import { CreateCompanyDialog } from './create_company_dialog';

export default async function CompaniesPage() {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        redirect('/auth');
    }

    const ownedCompanies = await db.query.companies.findMany({
        where: (companies, { eq }) => eq(companies.ownerId, currentUser.id),
        with: {
            resources: true,
        },
    });

    const allCompanies = await db.query.companies.findMany({
        with: {
            resources: true,
        },
    });

    return (
        <div className="space-y-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Your companies</CardTitle>
                </CardHeader>
                <CardContent>
                    <CompanyTable companies={ownedCompanies} />
                </CardContent>
                <CardFooter className="flex flex-row-reverse">
                    <CreateCompanyDialog />
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top companies</CardTitle>
                </CardHeader>
                <CardContent>
                    <CompanyTable companies={allCompanies} forRanking />
                </CardContent>
            </Card>
        </div>
    );
}
