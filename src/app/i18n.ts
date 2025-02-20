import { getRequestConfig } from 'next-intl/server';

export const dynamic = 'force-dynamic';

const locales = ['en', 'es', 'eu']; // Should match your middleware locales

export const localePrefix = 'as-needed'; // Or 'always' if you want locale prefix in paths

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locales.includes(locale as any)) {
        return {
            messages: (await import(`../locales/en.json`)).default
        };
    }

    return {
        locale: locale,
        messages: (await import(`../locales/${locale}.json`)).default
    };
});