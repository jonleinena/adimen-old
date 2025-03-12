import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { ModernPricingSection } from '@/features/pricing/components/modern-pricing-section';
import { getProducts } from '@/features/pricing/controllers/get-products';

export default async function PricingPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Get the user's session and subscription
  const [session, subscription, products] = await Promise.all([
    getSession(),
    getSubscription(),
    getProducts()
  ]);

  // Test mode: Only enabled in development environment and if ?test=true is in the URL
  const isTestMode =
    process.env.NODE_ENV === 'development' &&
    searchParams?.test === 'true';

  let testSession = session;
  let testSubscription = subscription;

  if (isTestMode && !session) {
    // Create a mock session for testing (only in development)
    testSession = {
      user: { id: 'test-user-id', email: 'test@example.com' }
    } as any;

    // Create a mock subscription using the first product's first price
    if (products.length > 0 && products[0].prices.length > 0) {
      testSubscription = {
        id: 'test-subscription-id',
        price_id: products[0].prices[0].id,
        status: 'active'
      } as any;
    }

    console.log('⚠️ USING TEST MODE - This should only appear in development');
  }

  return <ModernPricingSection
    isPricingPage
    session={testSession}
    subscription={testSubscription}
    products={products}
  />;
}
