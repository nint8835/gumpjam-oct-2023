import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { resources } from '@/db/schema';
import { cn } from '@/lib/utils';
import { ResourceType, Resources } from '@/resources';
import { CraftingData } from '@/resources/craft_data';
import { formatResourceAmount } from '@/resources/utils';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { craftResource } from './handlers';

export function CraftResourceDialog({
    resource,
    companyId,
    open,
    setOpen,
    allResources,
}: {
    resource: typeof resources.$inferSelect | null;
    allResources: (typeof resources.$inferSelect)[];
    companyId: number;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (open) {
            if (resource !== null && Resources[resource.type].crafting?.forbidMultiCraft) {
                setAmount(1);
            } else {
                setAmount(0);
            }
        }
    }, [resource, open, setAmount]);

    const { toast } = useToast();

    if (resource === null || Resources[resource.type].crafting === undefined) {
        return null;
    }

    const craftingData = new CraftingData(allResources, resource.type);
    const requiredIngredients = craftingData.requiredIngredients(amount);
    const yieldResources = craftingData.yield(amount);

    const valueDifference =
        yieldResources
            .map(([resourceType, resourceAmount]) => Resources[resourceType].value * resourceAmount)
            .reduce((a, b) => a + b, 0) -
        requiredIngredients
            .map(([resourceType, resourceAmount]) => Resources[resourceType].value * resourceAmount)
            .reduce((a, b) => a + b, 0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Craft {Resources[resource.type].name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {!Resources[resource.type].crafting?.forbidMultiCraft && (
                        <>
                            <Label>Amount</Label>
                            <div>
                                <Slider
                                    value={[amount]}
                                    onValueChange={([value]) => setAmount(value)}
                                    max={craftingData.maxCraftable}
                                />
                                <div className="flex justify-center pt-1 text-muted-foreground">
                                    {amount.toLocaleString()}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex flex-row items-center justify-between gap-1">
                        <div className="flex-1">
                            {requiredIngredients.length > 0 ? (
                                requiredIngredients.map(([resourceType, resourceAmount]) => (
                                    <div key={resourceType} className="flex items-center justify-between">
                                        <div>{Resources[resourceType].name}</div>
                                        <div>{formatResourceAmount(resourceType, resourceAmount)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="italic text-muted-foreground">Nothing</div>
                            )}
                        </div>
                        <ArrowRight className="m-1" />
                        <div className="flex-1">
                            {yieldResources.length > 0 ? (
                                yieldResources.map(([resourceType, resourceAmount]) => (
                                    <div key={resourceType} className="flex items-center justify-between">
                                        <div>{Resources[resourceType].name}</div>
                                        <div>{formatResourceAmount(resourceType, resourceAmount)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="italic text-muted-foreground">Nothing</div>
                            )}
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
                                {formatResourceAmount(ResourceType.Money, Math.abs(valueDifference))}
                            </span>{' '}
                            from this craft.
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
