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

    const companies = await db.query.companies.findMany({
        where: (companies, { eq }) => eq(companies.ownerId, currentUser.id),
    });

    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle>Companies</CardTitle>
            </CardHeader>
            <CardContent>
                <CompanyTable companies={companies} />
            </CardContent>
            <CardFooter className="flex flex-row-reverse">
                <CreateCompanyDialog />
            </CardFooter>
        </Card>
    );
}
