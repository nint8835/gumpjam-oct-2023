'use client';

import TooltipButton from '@/components/tooltip_button';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { resources as resourcesTable } from '@/db/schema';
import { cn } from '@/lib/utils';
import { ResourceCategory, ResourceCategoryOrder, ResourceType, Resources } from '@/resources';
import { CraftingData } from '@/resources/craft_data';
import { formatResourceAmount } from '@/resources/utils';
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
    resources: (typeof resourcesTable.$inferSelect)[];
    isOwner: boolean;
    companyId: number;
}) {
    const { toast } = useToast();

    const [sellDialogOpen, setSellDialogOpen] = useState(false);
    const [craftDialogOpen, setCraftDialogOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<typeof resourcesTable.$inferSelect | null>(null);

    const groupedResources = resources
        .filter((resource) => resource.type !== ResourceType.Money)
        .reduce(
            (acc, resource) => {
                const category = Resources[resource.type].category;

                if (!acc[category]) {
                    acc[category] = [];
                }

                acc[category].push(resource);

                return acc;
            },
            {} as Record<ResourceCategory, typeof resources>,
        );

    const sortedResourceGroups = Object.entries(groupedResources).sort(
        ([a], [b]) =>
            ResourceCategoryOrder.indexOf(a as ResourceCategory) - ResourceCategoryOrder.indexOf(b as ResourceCategory),
    );

    return (
        <>
            <Tabs defaultValue={sortedResourceGroups[0][0]} className="w-full">
                <TabsList className={cn('w-full', sortedResourceGroups.length === 1 && 'hidden')}>
                    {sortedResourceGroups.map(([category]) => (
                        <TabsTrigger key={category} value={category} className="flex-1">
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {sortedResourceGroups.map(([category, resources]) => (
                    <TabsContent key={category} value={category}>
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
                                        <TableCell>
                                            <div>{Resources[resource.type].name}</div>
                                            <div className="italic text-muted-foreground">
                                                {Resources[resource.type].description}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatResourceAmount(resource.type, resource.amount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatResourceAmount(
                                                ResourceType.Money,
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
                                                            <Tractor className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipButton>
                                                )}
                                                {Resources[resource.type].crafting && (
                                                    <TooltipButton tooltip="Craft">
                                                        <Button
                                                            variant="ghost"
                                                            disabled={
                                                                new CraftingData(resources, resource.type)
                                                                    .maxCraftable === 0
                                                            }
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
                    </TabsContent>
                ))}
            </Tabs>
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
