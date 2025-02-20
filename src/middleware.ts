import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { updateSession } from '@/libs/supabase/supabase-middleware-client';

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

  let locale = request.cookies.get('NEXT_LOCALE')?.value; // Check if locale is already set in cookies

  if (!locale) {
    // If no locale in cookies, detect from browser Accept-Language header
    const browserLocale = request.headers.get('Accept-Language')?.split(',')[0]?.split('-')[0]; // Get browser language, e.g., 'en' from 'en-US'
    if (browserLocale && locales.includes(browserLocale)) {
      locale = browserLocale;
    } else {
      locale = defaultLocale; // Fallback to default if no browser preference or unsupported
    }
  }

  // 3. Set NEXT_LOCALE cookie if it's not already set or needs updating
  if (!request.cookies.has('NEXT_LOCALE') || request.cookies.get('NEXT_LOCALE')?.value !== locale) {
    supabaseResponse.cookies.set('NEXT_LOCALE', locale, { path: '/' }); // Set cookie for future requests
  }

  // 4. Apply next-intl middleware to handle routing and locale context
  request.headers.set('x-pathname', request.nextUrl.pathname); // next-intl needs this header
  const intlResponse = nextIntlMiddleware(request);
  intlResponse.headers.set('x-default-locale', defaultLocale); // next-intl also needs this

  // 5.  Important: Merge cookies from next-intl response into supabase response
  //     to ensure cookies are correctly set in the final response to the browser.
  intlResponse.cookies.getAll().forEach(cookie => {
    supabaseResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path || '/',
      maxAge: cookie.maxAge,
      domain: cookie.domain,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly
    });
  });

  // 5.  Important: Merge next‑intl headers (including the locale) into supabaseResponse
  supabaseResponse.headers.set(
    'x-next-intl-locale',
    intlResponse.headers.get('x-next-intl-locale') ?? locale
  );

  return supabaseResponse; // Return the modified supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};