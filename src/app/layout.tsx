import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Montserrat, Montserrat_Alternates } from 'next/font/google';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/features/chat/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';

import '@/styles/globals.css';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Adimen',
  description: 'AI Automation for your business',
};

const locales = ['en', 'es', 'eu']; // Should match your middleware locales

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat-alternates',
  weight: ['400', '500', '600', '700'],
});

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
    <html lang={localeFromHeader} suppressHydrationWarning>
      <body className={`overflow-x-hidden font-sans ${montserrat.variable} ${montserratAlternates.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={localeFromHeader} messages={messages}>
            <div className="flex min-h-screen flex-col">
              {children}
            </div>
            <Toaster />
            <Analytics />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}