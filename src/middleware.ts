import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { updateSession } from '@/libs/supabase/supabase-middleware-client';

import { getSession } from './features/account/controllers/get-session';
import { getUser } from './features/account/controllers/get-user';

const locales = ['en', 'es', 'eu']; // Add your supported locales here
const defaultLocale = 'en'; // Set your default locale

const nextIntlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false // We will handle locale detection manually
});

export async function middleware(request: NextRequest) {
  // 1. Update Supabase session (your existing middleware)
  const supabaseResponse = await updateSession(request);

  // 2. Custom Locale Detection Logic
  let locale: string | undefined;
  const session = await getSession();

  // If there is a logged in user, try to use their preferred language
  if (session) {
    const userData = await getUser();
    if (userData?.preferred_language) {
      locale = userData.preferred_language;
    }
  }

  // Only check cookies if no locale was found from the user session
  if (!locale) {
    locale = request.cookies.get('NEXT_LOCALE')?.value;
  }

  // Fallback if there is still no locale information (e.g., from the browser header)
  if (!locale) {
    const browserLocale = request.headers.get('Accept-Language')
      ?.split(',')[0]
      ?.split('-')[0]; // e.g., from 'en-US' extract 'en'
    if (browserLocale && locales.includes(browserLocale)) {
      locale = browserLocale;
    } else {
      locale = defaultLocale;
    }
  }

  // 3. Set NEXT_LOCALE cookie if it's not already set or if it needs updating
  if (!request.cookies.has('NEXT_LOCALE') || request.cookies.get('NEXT_LOCALE')?.value !== locale) {
    supabaseResponse.cookies.set('NEXT_LOCALE', locale, { path: '/' });
  }

  // 4. Apply next-intl middleware to handle routing and locale context
  request.headers.set('x-pathname', request.nextUrl.pathname);
  const intlResponse = nextIntlMiddleware(request);
  intlResponse.headers.set('x-default-locale', defaultLocale);

  // 5. Merge cookies from next‑intl response into supabase response
  intlResponse.cookies.getAll().forEach(cookie => {
    supabaseResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path || '/',
      maxAge: cookie.maxAge,
      domain: cookie.domain,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly
    });
  });

  // 6. Merge next‑intl headers (including the locale) into supabaseResponse
  supabaseResponse.headers.set(
    'x-next-intl-locale',
    intlResponse.headers.get('x-next-intl-locale') ?? locale
  );

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};