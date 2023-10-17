'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, RootFormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createCompany } from './handlers';
import { createCompanySchema } from './schema';

function CreateCompanyForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const form = useForm<z.infer<typeof createCompanySchema>>({
        resolver: zodResolver(createCompanySchema),
        defaultValues: {
            name: '',
        },
    });

    const { toast } = useToast();

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(async (args) => {
                    const resp = await createCompany(args);

                    console.log(resp);

                    if (!resp.success) {
                        form.setError(resp.field, { message: resp.message });
                        return;
                    }

                    toast({
                        title: 'Company created',
                        description: 'Your company has been created successfully.',
                    });
                    setOpen(false);
                })}
                className="space-y-4"
            >
                <DialogHeader>
                    <DialogTitle>New Company</DialogTitle>
                </DialogHeader>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <RootFormMessage />
                <DialogFooter>
                    <Button type="submit">Submit</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

export function CreateCompanyDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>New Company</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <CreateCompanyForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
