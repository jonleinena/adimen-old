import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';

import { Logo } from '@/components/logo';
import { getActivePromotions, PromotionDetails } from '@/features/pricing/controllers/get-active-promotions';

import { Navigation } from '../navigation';

export default async function PublicLayout({ children }: PropsWithChildren<{}>) {
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
        <>
            {/* Promotion Banner - only show if there are active promotions */}
            {promotionDetails.exists && (
                <div className="bg-black px-4 py-2 text-center text-sm text-primary-foreground">
                    <div className="container flex items-center justify-center gap-x-4">
                        <span>
                            {t.rich('start_now')}&nbsp;
                            {promotionDetails.percentOff
                                ? t.rich('percent_off', { percent: promotionDetails.percentOff })
                                : t.rich('special_offer')}
                        </span>
                        <Link
                            href="/pricing"
                            className="flex items-center gap-x-1 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/80"
                        >
                            {t('subscribe')}
                        </Link>
                    </div>
                </div>
            )}

            <Navigation />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </>
    );
}

async function Footer() {
    const t = await getTranslations('footer');

    return (
        <footer className="border-t">
            <div className="container py-16">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                    <div className="flex flex-col gap-2">
                        <Logo />
                        <p className="text-sm text-muted-foreground">{t('slogan')}</p>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <h3 className="font-medium">{t('product.title')}</h3>
                        <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t('product.features')}
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t('product.how_it_works')}
                        </Link>
                        <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t('product.pricing')}
                        </Link>
                        <Link href="#faqs" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t('product.faqs')}
                        </Link>
                    </nav>
                    <nav className="flex flex-col gap-2">
                        <h3 className="font-medium">{t('company.title')}</h3>
                        <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t('company.about')}
                        </Link>
                        <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t('company.contact')}
                        </Link>
                    </nav>
                    <nav className="flex flex-col gap-2">
                        <h3 className="font-medium">{t('legal.title')}</h3>
                        <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t('legal.terms')}
                        </Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t('legal.privacy')}
                        </Link>
                        <Link href="/cookies" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t('legal.cookies')}
                        </Link>
                    </nav>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-medium">{t('follow_us')}</h3>
                        <div className="flex gap-2">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <IoLogoTwitter size={20} />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <IoLogoFacebook size={20} />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <IoLogoInstagram size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Adimen. {t('rights_reserved')}
                    </p>
                </div>
            </div>
        </footer>
    );
} 