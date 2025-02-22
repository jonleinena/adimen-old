import type { AbstractIntlMessages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

export const dynamic = 'force-dynamic';

const locales = ['en', 'es', 'eu']; // Should match your middleware locales

export const localePrefix = 'as-needed'; // Or 'always' if you want locale prefix in paths

function flattenMessages(obj: any, prefix = ''): Record<string, string> {
    return Object.keys(obj).reduce((acc: Record<string, string>, k: string) => {
        const pre = prefix.length ? `${prefix}.` : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenMessages(obj[k], `${pre}${k}`));
        } else {
            acc[`${pre}${k}`] = JSON.stringify(obj[k]);
        }
        return acc;
    }, {});
}

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;
    let rawMessages;

    try {
        if (!locales.includes(locale as any)) {
            rawMessages = (await import(`../locales/en.json`)).default;
        } else {
            rawMessages = (await import(`../locales/${locale}.json`)).default;
        }

        const messages = flattenMessages(rawMessages) as AbstractIntlMessages;

        return {
            locale,
            messages,
            defaultTranslationValues: {
                highlight: (chunks) => chunks,
            },
        };
    } catch (error) {
        console.error(`Error loading messages for locale: ${locale}`, error);
        rawMessages = (await import(`../locales/en.json`)).default;
        const messages = flattenMessages(rawMessages) as AbstractIntlMessages;
        return { messages };
    }
});