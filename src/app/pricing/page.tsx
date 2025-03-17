import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { ModernPricingSection } from '@/features/pricing/components/modern-pricing-section';
import { getProducts } from '@/features/pricing/controllers/get-products';

export default async function PricingPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await the searchParams
  const resolvedSearchParams = await searchParams;

  // Get the user's session and subscription
  const [session, subscription, products] = await Promise.all([
    getSession(),
    getSubscription(),
    getProducts()
  ]);

  return <ModernPricingSection
    isPricingPage
    session={session}
    subscription={subscription}
    products={products}
  />;
}
