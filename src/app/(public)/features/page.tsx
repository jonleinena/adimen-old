import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/container';
import { FeaturesSection } from '@/components/features-section';
import { IntegrationPreview } from '@/components/integration-preview';
import { SolutionPreview } from '@/components/solution-preview';

export default async function FeaturesPage() {
    const t = await getTranslations('features');

    return (
        <div className="py-24">
            <Container>
                <div className="mx-auto max-w-3xl text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{t('title')}</h1>
                    <p className="mt-4 text-lg text-muted-foreground">{t('description')}</p>
                </div>

                <div className="space-y-32">
                    {/* Main Features */}
                    <section>
                        <div className="mx-auto max-w-[58rem] space-y-4 text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t('main_features.title')}</h2>
                            <p className="text-muted-foreground">{t('main_features.description')}</p>
                        </div>
                        <FeaturesSection />
                    </section>

                    {/* Integration */}
                    <section>
                        <div className="mx-auto max-w-[58rem] space-y-4 text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t('integrations.title')}</h2>
                            <p className="text-muted-foreground">{t('integrations.description')}</p>
                        </div>
                        <IntegrationPreview />
                    </section>

                    {/* Solutions */}
                    <section>
                        <div className="mx-auto max-w-[58rem] space-y-4 text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t('solutions.title')}</h2>
                            <p className="text-muted-foreground">{t('solutions.description')}</p>
                        </div>
                        <SolutionPreview />
                    </section>
                </div>
            </Container>
        </div>
    );
} 