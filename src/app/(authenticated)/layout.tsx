import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { LayoutDashboard, Settings } from 'lucide-react';

import { AccountMenu } from '@/components/account-menu';
import { getSession } from '@/features/account/controllers/get-session';

import { signOut } from '../(public)/auth-actions';

export default async function AuthLayout({ children }: PropsWithChildren<{}>) {
    const session = await getSession();

    // If user is not authenticated, redirect to login page
    if (!session) {
        redirect('/login');
    }

    const t = await getTranslations('dashboard');

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="w-full border-b bg-[#f8f5f2] dark:bg-[#242525]">
                <div className="container flex h-16 items-center justify-between text-black dark:text-[#ECECF1]">
                    <Link href="/chat" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">Adimen</span>
                    </Link>

                    <nav className="flex items-center space-x-8">
                        <Link href="/chat" className="text-sm font-medium hover:text-primary flex items-center gap-2">
                            <LayoutDashboard size={16} />
                            dashboard
                        </Link>
                        <Link href="/settings" className="text-sm font-medium hover:text-primary flex items-center gap-2">
                            <Settings size={16} />
                            settings
                        </Link>
                    </nav>

                    <div className="flex items-center justify-end min-w-[150px]">
                        <AccountMenu signOut={signOut} />
                    </div>
                </div>
            </header>

            <main className="flex-1 container">
                {children}
            </main>

            <footer className="border-t py-6">
                <div className="container">
                    <p className="text-sm text-muted-foreground text-center">
                        © {new Date().getFullYear()} Adimen. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
} 