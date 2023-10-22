import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db';
import { ImpersonateForm } from './form';

export default async function ImpersonatePage() {
    const users = await db.query.users.findMany();

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Impersonate</CardTitle>
                    <CardDescription>
                        Replace your current session with one belonging to a specified user.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ImpersonateForm users={users} />
                </CardContent>
            </Card>
        </div>
    );
}
