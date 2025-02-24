import { useTranslations } from 'next-intl';
import { ArrowRight } from "lucide-react";
import { Star } from "lucide-react";

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
import { PricingSection } from '@/features/pricing/components/pricing-section';


export default function HomePage() {
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
            Powered by Leading AI Technologies
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            We integrate with state-of-the-art AI models and platforms to deliver exceptional results
          </p>
        </div>
        <AICompanyLogos />
      </Container>

      {/* Feature Selection */}
      <Container>
        <div className="mx-auto max-w-[58rem] space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Customize Your AI Solution
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Select the features you need to transform your business
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <FeatureSelector />
        </div>
      </Container>

      {/* Integration Preview */}
      <Container>
        <div className="mx-auto max-w-[58rem] space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Seamless Integration
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Connect with your favorite tools in minutes
          </p>
        </div>
        <IntegrationPreview />
      </Container>

      {/* Features Section */}
      <Container>
        <div className="mx-auto max-w-[58rem] space-y-4 text-center py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Enterprise Features, SME Simplicity
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Everything you need to integrate AI into your business workflows
          </p>
        </div>
        <FeaturesSection />
      </Container>

      {/* Solution Preview */}
      <Container>
        <div className="mx-auto max-w-[58rem] space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Your Business, AI-Powered
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Watch your workflows transform with intelligent automation
          </p>
        </div>
        <SolutionPreview />
      </Container>

      <UseCaseSection />

      {/* How It Works */}
      <Container>
        <div className="mx-auto max-w-[58rem] space-y-4 text-center py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple Steps to AI Success
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Get started in minutes, see results in days
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
    </div>
  );
}


function HeroSection() {
  const t = useTranslations();

  return (
    <div className="relative container py-24 space-y-8 md:space-y-16">
      <div className="mx-auto max-w-[64rem] space-y-8 text-center">
        <Badge variant="outline" className="w-fit mx-auto px-4 py-1 border-radius-full rounded-full">
          Trusted by 500+ SMEs
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
          AI Automation for Every Business
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Transform your business operations with AI agents that integrate seamlessly with your existing tools. No
          technical expertise required.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="h-12">
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-12">
            Schedule Demo
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
          <span className="text-muted-foreground">4.8/5 from 200+ reviews</span>
        </div>
      </div>
    </div>
  );
}

function UseCaseSection() {
  const t = useTranslations();

  return (
    <section className="container py-24 space-y-8">
      <div className="mx-auto max-w-[58rem] space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('use-case.title')}</h2>
        <p className="text-muted-foreground sm:text-lg">{t('use-case.description')}</p>
      </div>
      <UseCaseCarousel />
    </section>
  );
}

function FAQs() {
  const t = useTranslations();

  return (
    <section className="container py-24 space-y-8 border-t">
      <div className="mx-auto max-w-[58rem] space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('faq.title')}</h2>
        <p className="text-muted-foreground sm:text-lg">{t('faq.description')}</p>
      </div>
      <FAQSection />
    </section>
  );
}