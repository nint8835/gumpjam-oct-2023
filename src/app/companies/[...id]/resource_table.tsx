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
import { useState } from 'react';
import { CraftResourceDialog } from './craft_dialog';
import { produceResource } from './handlers';
import { SellResourceDialog } from './sell_dialog';

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

    const [sellDialogOpen, setSellDialogOpen] = useState(false);
    const [craftDialogOpen, setCraftDialogOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<{
        type: ResourceType;
        amount: number;
    } | null>(null);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        {isOwner && <TableHead className="w-0" />}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources
                        .filter((resource) => resource.type !== ResourceType.Money)
                        .map((resource) => (
                            <TableRow key={resource.type}>
                                <TableCell>{Resources[resource.type].name}</TableCell>
                                <TableCell className="text-right">
                                    {Resources[resource.type].valueString(resource.amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {Resources[ResourceType.Money].valueString(
                                        Resources[resource.type].value * resource.amount,
                                    )}
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
                                                            const resp = await produceResource(
                                                                resource.type,
                                                                companyId,
                                                            );
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
                                                {Resources[resource.type].crafting && (
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedResource(resource);
                                                            setCraftDialogOpen(true);
                                                        }}
                                                    >
                                                        Craft
                                                    </DropdownMenuItem>
                                                )}
                                                {Resources[resource.type].isSellable && (
                                                    <DropdownMenuItem
                                                        disabled={resource.amount === 0}
                                                        onClick={() => {
                                                            setSelectedResource(resource);
                                                            setSellDialogOpen(true);
                                                        }}
                                                    >
                                                        Sell
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
            <SellResourceDialog
                open={sellDialogOpen}
                setOpen={setSellDialogOpen}
                resource={selectedResource}
                companyId={companyId}
            />
            <CraftResourceDialog
                open={craftDialogOpen}
                setOpen={setCraftDialogOpen}
                resource={selectedResource}
                allResources={resources}
                companyId={companyId}
            />
        </>
    );
}
