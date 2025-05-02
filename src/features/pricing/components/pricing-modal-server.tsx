import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { ModernPricingSection } from '@/features/pricing/components/modern-pricing-section';
import { getProducts } from '@/features/pricing/controllers/get-products';

interface PricingModalServerProps {
    currentPath: string; // Need the path to link back correctly
}

// This is an async Server Component
export async function PricingModalServer({ currentPath }: PricingModalServerProps) {

    // Fetch data server-side
    const [session, subscription, products, t] = await Promise.all([
        getSession(),
        getSubscription(),
        getProducts(),
        getTranslations('pricing') // Fetch translations here
    ]);

    // Construct the close URL (remove showPricing param)
    const closeUrl = new URL(currentPath, 'http://localhost'); // Base URL is arbitrary, only path/search matters
    closeUrl.searchParams.delete('showPricing');
    const closeHref = `${closeUrl.pathname}${closeUrl.search}`;

    return (
        // Make this div fill the screen, keep z-index
        <div className="fixed inset-0 z-50 bg-[#f8f5f2] dark:bg-[#242525] text-black dark:text-white">
            {/* This div is now the main container, remove sizing/styling constraints */}
            <div className="relative w-full h-full flex flex-col overflow-hidden">
                {/* Close Button - Link back to original path (position should still be ok) */}
                <Link href={closeHref} scroll={false} replace>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </Link>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <ModernPricingSection
                        session={session}
                        subscription={subscription}
                        products={products || []}
                    />
                </div>
            </div>
        </div>
    );
} 