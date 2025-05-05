import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { IoMenu } from 'react-icons/io5';

import { AccountMenu } from '@/components/account-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { getSession } from '@/features/account/controllers/get-session';

import { signOut } from './(public)/auth-actions';

export async function Navigation() {
  const session = await getSession();
  const t = await getTranslations('navigation');
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Adimen</span>
          </Link>

          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              {t('features')}
            </Link>
            <Link href="#solution" className="text-sm font-medium hover:text-primary">
              {t('solution')}
            </Link>
            <Link href="#integrations" className="text-sm font-medium hover:text-primary">
              {t('integrations')}
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              {t('pricing')}
            </Link>
          </nav>

          <div className="flex items-center justify-end min-w-[250px]">
            {session ? (
              <AccountMenu signOut={signOut} />
            ) : (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <Button variant="outline">{t('contact_sales')}</Button>
                  <Button asChild>
                    <Link href="/signup">{t('get_started')}</Link>
                  </Button>
                </div>
                <Sheet>
                  <SheetTrigger className="block md:hidden">
                    <IoMenu size={28} />
                  </SheetTrigger>
                  <SheetContent className="w-full bg-black">
                    <SheetHeader>
                      <span className="text-xl font-bold">Adimen</span>
                      <SheetDescription className="space-y-4 py-8">
                        <div className="flex flex-col space-y-4">
                          <Link href="#features" className="text-sm font-medium hover:text-primary">
                            {t('features')}
                          </Link>
                          <Link href="#solution" className="text-sm font-medium hover:text-primary">
                            {t('solution')}
                          </Link>
                          <Link href="#integrations" className="text-sm font-medium hover:text-primary">
                            {t('integrations')}
                          </Link>
                          <Link href="#pricing" className="text-sm font-medium hover:text-primary">
                            {t('pricing')}
                          </Link>
                        </div>
                        <div className="flex flex-col space-y-4">
                          <Button variant="outline">
                            <Link href="/contact">{t('contact_sales')}</Link>
                          </Button>
                          <Button variant="blueOutline" asChild>
                            <Link href="/signup">{t('get_started')}</Link>
                          </Button>
                        </div>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
