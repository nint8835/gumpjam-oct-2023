'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { companies as companiesTable, resources } from '@/db/schema';
import { ResourceType, Resources } from '@/resources';
import { getCompanyValue } from '@/resources/utils';
import { useRouter } from 'next/navigation';

export function CompanyTable({
    companies,
}: {
    companies: (typeof companiesTable.$inferSelect & { resources: (typeof resources.$inferSelect)[] })[];
}) {
    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {companies.map((company) => (
                    <TableRow
                        className="hover:cursor-pointer"
                        key={company.id}
                        onClick={() => router.push(`/companies/${company.id}`)}
                    >
                        <TableCell>{company.name}</TableCell>
                        <TableCell>{Resources[ResourceType.Money].valueString(getCompanyValue(company))}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}