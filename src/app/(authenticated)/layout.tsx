import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';

import { getSession } from '@/features/account/controllers/get-session';

export default async function AuthLayout({ children }: PropsWithChildren<{}>) {
    const session = await getSession();

    // If user is not authenticated, redirect to login page
    if (!session) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
} 