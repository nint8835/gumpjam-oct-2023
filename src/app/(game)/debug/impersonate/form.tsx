'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, RootFormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { users as usersTable } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { impersonateUser } from './handler';
import { impersonateSchema } from './schema';

export function ImpersonateForm({ users }: { users: (typeof usersTable.$inferSelect)[] }) {
    const form = useForm<z.infer<typeof impersonateSchema>>({
        resolver: zodResolver(impersonateSchema),
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(async (args) => {
                    const resp = await impersonateUser({
                        id: args.id,
                    });

                    if (!resp.success) {
                        form.setError(resp.field, { message: resp.message });
                        return;
                    }
                })}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user to impersonate" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Impersonate</Button>
                <RootFormMessage />
            </form>
        </Form>
    );
}
