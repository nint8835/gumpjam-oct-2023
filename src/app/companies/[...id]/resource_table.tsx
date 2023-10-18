'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { ResourceType, Resources } from '@/resources';
import { MoreHorizontal } from 'lucide-react';
import { produceResource } from './handlers';

export function ResourceTable({
    resources,
    isOwner,
    companyId,
}: {
    resources: {
        type: ResourceType;
        amount: number;
    }[];
    isOwner: boolean;
    companyId: number;
}) {
    const { toast } = useToast();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    {isOwner && <TableHead className="w-0" />}
                </TableRow>
            </TableHeader>
            <TableBody>
                {resources.map((resource) => (
                    <TableRow key={resource.type}>
                        <TableCell>{Resources[resource.type].name}</TableCell>
                        <TableCell className="text-right">
                            {Resources[resource.type].valueString(resource.amount)}
                        </TableCell>
                        {isOwner && (
                            <TableCell className="w-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="h-8 w-8 p-0" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {Resources[resource.type].isManuallyProducable && (
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    const resp = await produceResource(resource.type, companyId);
                                                    if (!resp.success) {
                                                        toast({
                                                            title: 'Error producing resource',
                                                            description: resp.message,
                                                            variant: 'destructive',
                                                        });
                                                    }
                                                }}
                                            >
                                                Produce
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
