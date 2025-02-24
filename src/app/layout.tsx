import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Montserrat, Montserrat_Alternates } from 'next/font/google';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';

import { CountdownTimer } from '@/components/countdown-timer';
import { Logo } from '@/components/logo';
import { Toaster } from '@/components/ui/toaster';
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

  return (
    <html lang={localeFromHeader}>
      <body
        className={'overflow-x-hidden'}
      >
        <NextIntlClientProvider locale={localeFromHeader} messages={messages}>
          <div>
            <div className="flex min-h-screen flex-col">
              {/* Promotion Banner */}
              <div className="bg-black px-4 py-2 text-center text-sm text-primary-foreground">
                <div className="container flex items-center justify-center gap-x-4">
                  <span>Start now and save 50% for 3 months</span>
                  <CountdownTimer />
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <Navigation />
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

function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adimen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}