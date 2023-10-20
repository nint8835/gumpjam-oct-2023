import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { ResourceType, Resources } from '@/resources';
import { formatResourceAmount } from '@/resources/utils';
import { useEffect, useState } from 'react';
import { sellResource } from './handlers';

export function SellResourceDialog({
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
                                {formatResourceAmount(resource.type, amount)}
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
                                    {formatResourceAmount(ResourceType.Money, Resources[resource.type].value * amount)}
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
