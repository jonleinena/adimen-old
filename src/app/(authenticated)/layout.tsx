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

    // If user is not authenticated, redirect to home page
    if (!session) {
        redirect('/');
    }

    const t = await getTranslations('dashboard');

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/chat" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">Adimen</span>
                    </Link>

                    <nav className="flex items-center space-x-8">
                        <Link href="/chat" className="text-sm font-medium hover:text-primary flex items-center gap-2">
                            <LayoutDashboard size={16} />
                            {t('dashboard')}
                        </Link>
                        <Link href="/settings" className="text-sm font-medium hover:text-primary flex items-center gap-2">
                            <Settings size={16} />
                            {t('settings')}
                        </Link>
                    </nav>

                    <div className="flex items-center justify-end min-w-[150px]">
                        <AccountMenu signOut={signOut} />
                    </div>
                </div>
            </header>

            <main className="flex-1 min-h-screen">
                {children}
            </main>

            <footer className="border-t py-6">
                <div className="container">
                    <p className="text-sm text-muted-foreground text-center">
                        © {new Date().getFullYear()} Adimen. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
} 