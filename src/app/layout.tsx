import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Montserrat, Montserrat_Alternates } from 'next/font/google';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';

import { CountdownTimer } from '@/components/countdown-timer';
import { Logo } from '@/components/logo';
import { Toaster } from '@/components/ui/toaster';
import { getSession } from '@/features/account/controllers/get-session';
import { getActivePromotions, PromotionDetails } from '@/features/pricing/controllers/get-active-promotions';
import { cn } from '@/utils/cn';
import { Analytics } from '@vercel/analytics/react';

import { Navigation } from './navigation';

import '@/styles/globals.css';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Adimen',
  description: 'AI Automation for your business',
};

const locales = ['en', 'es', 'eu']; // Should match your middleware locales

async function getMessages(locale: string) {
  try {
    return (await import(`../locales/${locale}.json`)).default;
  } catch (error) {
    notFound(); // In case of error, return 404
  }
}

export default async function RootLayout({
  children,
}: PropsWithChildren<{}>) {
  const headersList = await headers();
  const localeFromHeader = headersList.get('x-next-intl-locale') || 'en';

  if (!locales.includes(localeFromHeader)) {
    notFound();
  }

  const messages = await getMessages(localeFromHeader);
  const session = await getSession();
  const t = await getTranslations('promotion');

  // Fetch active promotions with error handling
  let promotionDetails: PromotionDetails = { exists: false };
  try {
    promotionDetails = await getActivePromotions();
  } catch (error) {
    console.error('Error checking for active promotions:', error);
    // If there's an error, we default to not showing the promotion banner
  }

  return (
    <html lang={localeFromHeader}>
      <body
        className={'overflow-x-hidden'}
      >
        <NextIntlClientProvider locale={localeFromHeader} messages={messages}>
          <div>
            <div className="flex min-h-screen flex-col">
              {!session && (
                <>
                  {/* Promotion Banner - only show if there are active promotions */}
                  {promotionDetails.exists && (
                    <div className="bg-black px-4 py-2 text-center text-sm text-primary-foreground">
                      <div className="container flex items-center justify-center gap-x-4">
                        <span>
                          {t.rich('start_now')}&nbsp;
                          {promotionDetails.percentOff
                            ? t.rich('percent_off', { percent: promotionDetails.percentOff })
                            : promotionDetails.amountOff && promotionDetails.currency
                              ? t.rich('amount_off', {
                                amount: (promotionDetails.amountOff / 100).toFixed(2),
                                currency: promotionDetails.currency.toUpperCase()
                              })
                              : t.rich('generic')}
                          {promotionDetails.durationInMonths
                            ? ` ${t.rich('for_months', { months: promotionDetails.durationInMonths })}`
                            : ''}
                          {promotionDetails.code
                            ? ` (${t.rich('code', { code: promotionDetails.code })})`
                            : ''}
                        </span>
                        {promotionDetails.expiresAt && <CountdownTimer expiresAt={promotionDetails.expiresAt} />}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                  <Navigation />
                </>
              )}
              <main className="relative flex-1">
                <div className="relative h-full">{children}</div>
              </main>
              <Footer />
            </div>
            <Toaster />
            <Analytics />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('product.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('product.features')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('product.security')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('product.enterprise')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('company.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('company.about')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('company.blog')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('company.careers')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('resources.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('resources.documentation')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('resources.help')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('resources.contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('legal.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('legal.terms')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  {t('legal.gdpr')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}