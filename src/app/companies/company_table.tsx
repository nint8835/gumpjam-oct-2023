'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { companies as companiesTable, resources } from '@/db/schema';
import { ResourceType } from '@/resources';
import { formatResourceAmount, getCompanyValue } from '@/resources/utils';
import { useRouter } from 'next/navigation';

export function CompanyTable({
    companies,
    forRanking = false,
}: {
    companies: (typeof companiesTable.$inferSelect & { resources: (typeof resources.$inferSelect)[] })[];
    forRanking?: boolean;
}) {
    const router = useRouter();

    if (forRanking) {
        companies.sort((a, b) => getCompanyValue(b) - getCompanyValue(a)).slice(0, 10);
    }

    return companies.length === 0 ? (
        <div className="flex w-full flex-row justify-center text-muted-foreground">
            {forRanking ? 'No companies exist yet.' : "You don't own any companies yet."}
        </div>
    ) : (
        <Table>
            <TableHeader>
                <TableRow>
                    {forRanking && <TableHead className="w-0">Rank</TableHead>}
                    <TableHead>Company</TableHead>
                    <TableHead>Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {companies.map((company, index) => (
                    <TableRow
                        className="hover:cursor-pointer"
                        key={company.id}
                        onClick={() => router.push(`/companies/${company.id}`)}
                    >
                        {forRanking && <TableCell className="w-0">{index + 1}</TableCell>}
                        <TableCell>{company.name}</TableCell>
                        <TableCell>{formatResourceAmount(ResourceType.Money, getCompanyValue(company))}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
