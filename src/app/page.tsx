import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl'; // Import useTranslations

import { Container } from '@/components/container';
import { FAQSection } from '@/components/faq-section';
import { Button } from '@/components/ui/button';
import { PricingSection } from '@/features/pricing/components/pricing-section';

export default async function HomePage() {
  return (
    <div className='flex flex-col gap-8 lg:gap-32'>
      <HeroSection />
      <ExamplesSection />
      <PricingSection />
      <FAQs />
    </div>
  );
}

function HeroSection() {
  const t = useTranslations(); // Get the translation function

  return (
    <section className='relative overflow-hidden lg:overflow-visible'>
      <Container className='relative rounded-lg bg-black py-20 lg:py-[140px]'>
        <div className='relative z-10 flex flex-col gap-5 lg:max-w-xl lg:pl-8'>
          <div className='w-fit rounded-full bg-gradient-to-r from-[#616571] via-[#7782A9] to-[#826674] px-4 py-1 '>
            <span className='font-alt text-sm font-semibold text-black mix-blend-soft-light'>
              Generate banners with DALL·E
            </span>
          </div>
          <h1>{t('hero.title')}</h1>
          <Button asChild variant='sexy'>
            <Link href='/signup'>{t('hero.button')}</Link>
          </Button>
        </div>
      </Container>
      <Image
        src='/hero-shape.png'
        width={867}
        height={790}
        alt=''
        className='absolute right-0 top-0 rounded-tr-lg'
        priority
        quality={100}
      />
    </section>
  );
}
function ExamplesSection() {
  return (
    <section className='flex flex-col gap-4 overflow-hidden rounded-lg bg-black py-8'>
      <div className='flex justify-center gap-4'>
        <Image
          className='flex-shrink-0'
          src='/example1.png'
          width={600}
          height={200}
          alt='Example of a generated banner'
          quality={100}
        />
        <Image
          className='flex-shrink-0'
          src='/example2.png'
          width={600}
          height={200}
          alt='Example of a generated banner'
          quality={100}
        />
        <Image
          className='flex-shrink-0'
          src='/example3.png'
          width={600}
          height={200}
          alt='Example of a generated banner'
          quality={100}
        />
      </div>
      <div className='flex gap-4'>
        <Image
          className='flex-shrink-0'
          src='/example4.png'
          width={600}
          height={200}
          alt='Example of a generated banner'
          quality={100}
        />
        <Image
          className='flex-shrink-0'
          src='/example5.png'
          width={600}
          height={200}
          alt='Example of a generated banner'
          quality={100}
        />
        <Image
          className='flex-shrink-0'
          src='/example6.png'
          width={600}
          height={200}
          alt='Example of a generated banner'
          quality={100}
        />
      </div>
      <div className='flex justify-center gap-4'>
        <Image
          className='flex-shrink-0'
          src='/example7.png'
          width={600}
          height={200}
          alt='Example of a generated banner'
          quality={100}
        />
        <Image
          className='flex-shrink-0'
          src='/example8.png'
          width={600}
          height={200}
          alt='Example of a generated banner'
          quality={100}
        />
        <Image
          className='flex-shrink-0'
          src='/example9.png'
          width={600}
          height={200}
          alt='Example of a generated banner'
          quality={100}
        />
      </div>
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