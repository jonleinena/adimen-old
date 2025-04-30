import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Star } from "lucide-react";

import { Container } from '@/components/container';
import { CTASection } from '@/components/cta-section';
import { FAQSection } from '@/components/faq-section';
import { FeatureSelector } from '@/components/feature-selector';
import { FeaturesSection } from '@/components/features-section';
import { HowItWorks } from '@/components/how-it-works';
import { IntegrationPreview } from '@/components/integration-preview';
import { AICompanyLogos } from '@/components/logos-slider';
import { SolutionPreview } from '@/components/solution-preview';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UseCaseCarousel } from '@/components/use-case-carousel';
import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { ModernPricingSection } from '@/features/pricing/components/modern-pricing-section';
import { getProducts } from '@/features/pricing/controllers/get-products';

export default async function HomePage() {
    const t = await getTranslations('home');

    // Get the user's session, subscription, and products
    const [session, subscription, products] = await Promise.all([
        getSession(),
        getSubscription(),
        getProducts()
    ]);

    return (
        <div className='flex flex-col gap-8 lg:gap-32'>
            {/* Hero Section */}
            <Container>
                <HeroSection />
            </Container>

            {/* Dashboard Preview */}
            <Container>
                <div className="mx-auto max-w-[58rem] space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t('ai_technologies.title')}
                    </h2>
                    <p className="text-muted-foreground sm:text-lg">
                        {t('ai_technologies.description')}
                    </p>
                </div>
                <AICompanyLogos />
            </Container>

            {/* Feature Selection */}
            <Container>
                <div className="mx-auto max-w-[58rem] space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t('customize.title')}
                    </h2>
                    <p className="text-muted-foreground sm:text-lg">
                        {t('customize.description')}
                    </p>
                </div>
                <div className="mx-auto max-w-2xl">
                    <FeatureSelector />
                </div>
            </Container>

            {/* Integration Preview */}
            <Container id="integrations">
                <div className="mx-auto max-w-[58rem] space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t('integration.title')}
                    </h2>
                    <p className="text-muted-foreground sm:text-lg">
                        {t('integration.description')}
                    </p>
                </div>
                <IntegrationPreview />
            </Container>

            {/* Features Section */}
            <Container id="features">
                <div className="mx-auto max-w-[58rem] space-y-4 text-center py-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t('features.title')}
                    </h2>
                    <p className="text-muted-foreground sm:text-lg">
                        {t('features.description')}
                    </p>
                </div>
                <FeaturesSection />
            </Container>


            {/* How It Works */}
            <Container>
                <div className="mx-auto max-w-[58rem] space-y-4 text-center py-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t('how_it_works.title')}
                    </h2>
                    <p className="text-muted-foreground sm:text-lg">
                        {t('how_it_works.description')}
                    </p>
                </div>
                <HowItWorks />
            </Container>

            {/* CTA Section */}
            <section className="border-t">
                <Container className="py-24">
                    <CTASection />
                </Container>
            </section>

            {/* FAQ Section */}
            <FAQs />

            {/* Pricing Section */}
            <section id="pricing" className="border-t">
                <Container className="py-24">
                    <ModernPricingSection
                        session={session}
                        subscription={subscription}
                        products={products}
                    />
                </Container>
            </section>
        </div>
    );
}

function HeroSection() {
    const t = useTranslations('hero_section');

    return (
        <div className="relative container py-24 space-y-8 md:space-y-16">
            <div className="mx-auto max-w-[64rem] space-y-8 text-center">
                <Badge variant="outline" className="w-fit mx-auto px-4 py-1 border-radius-full rounded-full">
                    {t('badge')}
                </Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
                    {t('title')}
                </h1>
                <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    {t('description')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="h-12">
                        {t('start_trial')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-12">
                        {t('schedule_demo')}
                    </Button>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm">
                    <div className="flex">
                        {Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                            ))}
                    </div>
                    <span className="text-muted-foreground">{t('reviews')}</span>
                </div>
            </div>
        </div>
    );
}

function UseCaseSection() {
    const t = useTranslations('use-case');

    return (
        <section className="container py-24 space-y-8">
            <div className="mx-auto max-w-[58rem] space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('title')}</h2>
                <p className="text-muted-foreground sm:text-lg">{t('description')}</p>
            </div>
            <UseCaseCarousel />
        </section>
    );
}

function FAQs() {
    const t = useTranslations('faq');

    return (
        <section className="container py-24 space-y-8 border-t">
            <div className="mx-auto max-w-[58rem] space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('title')}</h2>
                <p className="text-muted-foreground sm:text-lg">{t('description')}</p>
            </div>
            <FAQSection />
        </section>
    );
} 
