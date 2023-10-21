'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { companies as companiesTable, resources } from '@/db/schema';
import { ResourceType } from '@/resources';
import { formatResourceAmount, getCompanyValue } from '@/resources/utils';
import { useRouter } from 'next/navigation';

export function CompanyTable({
    companies,
}: {
    companies: (typeof companiesTable.$inferSelect & { resources: (typeof resources.$inferSelect)[] })[];
}) {
    const router = useRouter();

    return companies.length === 0 ? (
        <div className="flex w-full flex-row justify-center text-muted-foreground">
            {"You don't own any companies yet."}
        </div>
    ) : (
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
                        <TableCell>{formatResourceAmount(ResourceType.Money, getCompanyValue(company))}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
