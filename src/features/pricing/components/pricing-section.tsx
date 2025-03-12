import Image from 'next/image';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { PricingCard } from '@/features/pricing/components/price-card';
import { getProducts } from '@/features/pricing/controllers/get-products';
import { Price, ProductWithPrices } from '@/features/pricing/types';

import { createCheckoutAction } from '../actions/create-checkout-action';

export async function PricingSection({
  isPricingPage,
  locale,
  session,
  subscription
}: {
  isPricingPage?: boolean,
  locale?: string,
  session?: any,
  subscription?: any
}) {
  if (locale) {
    unstable_setRequestLocale(locale);
  }

  const products = await getProducts();
  const t = await getTranslations('pricing');

  const HeadingLevel = isPricingPage ? 'h1' : 'h2';

  // Find the user's current product and price if they have a subscription
  let userProduct: ProductWithPrices | undefined;
  let userPrice: Price | undefined;

  if (subscription) {
    for (const product of products) {
      for (const price of product.prices) {
        if (price.id === subscription.price_id) {
          userProduct = product;
          userPrice = price;
        }
      }
    }
  }

  return (
    <section className='relative rounded-lg bg-white py-8'>
      <div className='relative z-10 m-auto flex max-w-[1200px] flex-col items-center gap-8 px-4 pt-8 lg:pt-[140px]'>
        <HeadingLevel className='max-w-4xl bg-gradient-to-br from-black to-neutral-700 bg-clip-text text-center text-4xl font-bold text-transparent lg:text-6xl'>
          {t('title')}
        </HeadingLevel>
        <p className='text-center text-xl text-black'>
          {t('subtitle')}
        </p>

        {session && userProduct && userPrice && (
          <div className="w-full max-w-3xl mb-8">
            <h3 className="text-center text-xl mb-4 text-black">Your Current Plan</h3>
            <PricingCard
              key={userProduct.id}
              product={userProduct}
              price={userPrice}
              isCurrentPlan={true}
            />
          </div>
        )}

        <div className='flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:gap-8'>
          {products.map((product) => {
            // Skip rendering the user's current product in the list of available products
            if (userProduct && product.id === userProduct.id) {
              return null;
            }

            return (
              <PricingCard
                key={product.id}
                product={product}
                createCheckoutAction={createCheckoutAction}
              />
            );
          })}
        </div>
      </div>
      <Image
        src='/section-bg.png'
        width={1440}
        height={462}
        alt={t('background_image_alt')}
        className='absolute left-0 top-0 rounded-t-lg opacity-10'
        priority={isPricingPage}
        quality={100}
      />
    </section>
  );
}
