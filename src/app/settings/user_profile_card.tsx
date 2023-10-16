'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, RootFormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import type { SessionUser } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { updateUser } from './handlers';
import { updateUserSchema } from './schema';

export function UserProfileCard({ user }: { user: SessionUser }) {
    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            displayName: user.displayName,
        },
    });

    const { toast } = useToast();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(async (args) => {
                            const resp = await updateUser(args);

                            if (!resp.success) {
                                form.setError(resp.field, { message: resp.message });
                                return;
                            }

                            toast({
                                title: 'Profile updated',
                                description: 'Your profile has been updated successfully.',
                            });
                        })}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                        <RootFormMessage />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
