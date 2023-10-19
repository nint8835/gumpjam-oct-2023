import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { ResourceType, Resources } from '@/resources';
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
