import { ssrGetCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserProfileCard } from './user_profile_card';

export default async function SettingsPage() {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        redirect('/auth');
    }

    return (
        <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-4">
            <UserProfileCard user={currentUser} />
        </div>
    );
}
