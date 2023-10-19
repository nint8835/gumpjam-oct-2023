'use client';

import TooltipButton from '@/components/tooltip_button';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { ResourceType, Resources } from '@/resources';
import { Hammer, Store, Tractor } from 'lucide-react';
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
                                    <TableCell className="flex flex-row">
                                        {Resources[resource.type].isManuallyProducable && (
                                            <TooltipButton tooltip="Produce">
                                                <Button
                                                    variant="ghost"
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
                                                    <Tractor className="h-4 w-4" />
                                                </Button>
                                            </TooltipButton>
                                        )}
                                        {Resources[resource.type].crafting && (
                                            <TooltipButton tooltip="Craft">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setSelectedResource(resource);
                                                        setCraftDialogOpen(true);
                                                    }}
                                                >
                                                    <Hammer className="h-4 w-4" />
                                                </Button>
                                            </TooltipButton>
                                        )}
                                        {Resources[resource.type].isSellable && (
                                            <TooltipButton tooltip="Sell">
                                                <Button
                                                    variant="ghost"
                                                    disabled={resource.amount === 0}
                                                    onClick={() => {
                                                        setSelectedResource(resource);
                                                        setSellDialogOpen(true);
                                                    }}
                                                >
                                                    <Store className="h-4 w-4" />
                                                </Button>
                                            </TooltipButton>
                                        )}
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
