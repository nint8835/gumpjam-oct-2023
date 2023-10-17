'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { companies as companiesTable } from '@/db/schema';
import { useRouter } from 'next/navigation';

export function CompanyTable({ companies }: { companies: (typeof companiesTable.$inferSelect)[] }) {
    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Money</TableHead>
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
                        <TableCell>${company.money}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
