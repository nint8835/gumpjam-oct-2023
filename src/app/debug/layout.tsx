import { redirect } from 'next/navigation';

// TODO: I'm guessing this is probably more fit for a middleware, but I'm tired and this is the first thing to come to mind
export default function DebugLayout({ children }: { children: React.ReactNode }) {
    if (process.env.NODE_ENV !== 'development') {
        redirect('/');
    }

    return children;
}
