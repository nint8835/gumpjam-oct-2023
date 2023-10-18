'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { ResourceType, Resources } from '@/resources';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { craftResource, produceResource, sellResource } from './handlers';

function SellResourceDialog({
    resource,
    companyId,
    open,
    setOpen,
}: {
    resource: {
        type: ResourceType;
        amount: number;
    } | null;
    companyId: number;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (open) {
            setAmount(0);
        }
    }, [open, setAmount]);

    const { toast } = useToast();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {resource === null ? null : (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sell {Resources[resource.type].name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Label>Amount</Label>
                        <div>
                            <Slider
                                value={[amount]}
                                onValueChange={([value]) => setAmount(value)}
                                max={resource.amount}
                            />
                            <div className="flex justify-center pt-1 text-muted-foreground">
                                {Resources[resource.type].valueString(amount)}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex-row-reverse justify-between sm:flex-row-reverse sm:justify-between">
                        <Button
                            disabled={amount === 0}
                            onClick={async () => {
                                const resp = await sellResource({ resourceType: resource.type, amount, companyId });
                                setOpen(false);

                                if (!resp.success) {
                                    toast({
                                        title: 'Error selling resource',
                                        description: resp.message,
                                        variant: 'destructive',
                                    });
                                    return;
                                }

                                toast({
                                    title: 'Resource sold',
                                    description: 'Your resource has been sold successfully.',
                                });
                            }}
                        >
                            Sell
                        </Button>
                        {amount > 0 && (
                            <div className="flex self-center whitespace-pre">
                                You will receive{' '}
                                <span className="text-green-500">
                                    {Resources[ResourceType.Money].valueString(Resources[resource.type].value * amount)}
                                </span>{' '}
                                from this sale.
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}

function CraftResourceDialog({
    resource,
    companyId,
    open,
    setOpen,
    allResources,
}: {
    resource: {
        type: ResourceType;
        amount: number;
    } | null;
    allResources: {
        type: ResourceType;
        amount: number;
    }[];
    companyId: number;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (open) {
            setAmount(0);
        }
    }, [open, setAmount]);

    const { toast } = useToast();

    if (resource === null) {
        return null;
    }

    const resourceMeta = Resources[resource.type];

    const craftDetails = resourceMeta.crafting!;

    const maxCraftable = Math.min(
        ...Object.entries(craftDetails.ingredients).map(([resourceType, amount]) => {
            const resourceCount = allResources.find((r) => r.type === (resourceType as ResourceType))?.amount ?? 0;

            return Math.floor(resourceCount / amount);
        }),
    );

    const valueDifference =
        resourceMeta.value * craftDetails.yield * amount -
        Object.entries(craftDetails.ingredients)
            .map(
                ([resourceType, resourceCost]) => Resources[resourceType as ResourceType].value * resourceCost * amount,
            )
            .reduce((a, b) => a + b, 0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Craft {Resources[resource.type].name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Label>Amount</Label>
                    <div>
                        <Slider value={[amount]} onValueChange={([value]) => setAmount(value)} max={maxCraftable} />
                        <div className="flex justify-center pt-1 text-muted-foreground">
                            {Resources[resource.type].valueString(amount)}
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-1">
                        <div className="flex-1">
                            {Object.entries(craftDetails.ingredients).map(([resourceType, resourceCost]) => (
                                <div key={resourceType as ResourceType} className="flex items-center justify-between">
                                    <div>{Resources[resourceType as ResourceType].name}</div>
                                    <div>
                                        {Resources[resourceType as ResourceType].valueString(resourceCost * amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ArrowRight className="m-1" />
                        <div className="flex flex-1 items-center justify-between">
                            <div>{Resources[resource.type].name}</div>
                            <div>{Resources[resource.type].valueString(craftDetails.yield * amount)}</div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-row-reverse justify-between sm:flex-row-reverse sm:justify-between">
                    <Button
                        disabled={amount === 0}
                        onClick={async () => {
                            const resp = await craftResource({ resourceType: resource.type, amount, companyId });
                            setOpen(false);

                            if (!resp.success) {
                                toast({
                                    title: 'Error crafting resource',
                                    description: resp.message,
                                    variant: 'destructive',
                                });
                                return;
                            }

                            toast({
                                title: 'Resource crafted',
                                description: 'Your resource has been crafted successfully.',
                            });
                        }}
                    >
                        Craft
                    </Button>
                    {amount > 0 && (
                        <div className="flex self-center whitespace-pre">
                            You will {valueDifference >= 0 ? 'gain' : 'lose'}{' '}
                            <span className={cn(valueDifference >= 0 ? 'text-green-500' : 'text-red-500')}>
                                {Resources[ResourceType.Money].valueString(Math.abs(valueDifference))}
                            </span>{' '}
                            from this craft.
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

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
                    {resources.map((resource) => (
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
