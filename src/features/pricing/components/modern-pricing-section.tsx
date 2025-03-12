import { getTranslations } from 'next-intl/server';
import { Check, Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Session } from '@supabase/supabase-js';

import { createCheckoutAction } from '../actions/create-checkout-action';
import { productMetadataSchema } from '../models/product-metadata';
import { BillingInterval, Price, ProductWithPrices, Subscription } from '../types';

interface ModernPricingSectionProps {
    isPricingPage?: boolean;
    locale?: string;
    session?: Session | null;
    subscription?: Subscription | null;
    products: ProductWithPrices[];
}

export async function ModernPricingSection({
    isPricingPage,
    locale,
    session,
    subscription,
    products
}: ModernPricingSectionProps) {
    const t = await getTranslations('pricing');

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

    // Format the next billing date
    const nextBillingDate = subscription?.current_period_end
        ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';

    // Calculate discount percentage for annual billing
    const getDiscountPercentage = (monthlyPrice?: number | null, yearlyPrice?: number | null) => {
        if (!monthlyPrice || !yearlyPrice || monthlyPrice === 0) return 0;
        const monthlyTotal = monthlyPrice * 12;
        const savings = monthlyTotal - yearlyPrice;
        return Math.round((savings / monthlyTotal) * 100);
    };

    // Sort products by price (lowest to highest)
    const sortedProducts = [...products].sort((a, b) => {
        const aPrice = a.prices.find(p => p.interval === 'month')?.unit_amount || 0;
        const bPrice = b.prices.find(p => p.interval === 'month')?.unit_amount || 0;
        return aPrice - bPrice;
    });

    return (
        <div className="container max-w-6xl mx-auto py-12 px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-3xl md:text-4xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('subtitle')}
                    {session && userProduct && (
                        <>
                            {" "}{t('current_plan_prefix', { default: "You're currently on the" })}{" "}
                            <span className="font-medium text-primary">
                                {userProduct.name}
                            </span>{" "}
                            {t('current_plan_suffix', { default: "plan" })}.
                        </>
                    )}
                </p>

                {/* Billing interval selector could be added here in the future */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sortedProducts.map((product) => {
                    // Try to parse metadata, with fallback for missing fields
                    let metadata;
                    try {
                        metadata = productMetadataSchema.parse(product.metadata);
                    } catch (error) {
                        // Provide default metadata if parsing fails
                        const productName = product.name?.toLowerCase() || '';
                        metadata = {
                            priceCardVariant: productName.includes('pro') ? 'pro' :
                                productName.includes('enterprise') ? 'enterprise' : 'basic',
                            generatedImages: productName.includes('enterprise') ? 'enterprise' : 10,
                            imageEditor: productName.includes('pro') || productName.includes('enterprise') ? 'pro' : 'basic',
                            supportLevel: productName.includes('enterprise') ? 'live' : 'email'
                        };
                    }

                    const isCurrentPlan = userProduct?.id === product.id;
                    const isPro = metadata.priceCardVariant === 'pro';

                    // Get prices for the current billing interval
                    const monthlyPrice = product.prices.find(p => p.interval === 'month')?.unit_amount;
                    const yearlyPrice = product.prices.find(p => p.interval === 'year')?.unit_amount;

                    // Just use the monthly price for display
                    const displayPrice = monthlyPrice;

                    // Calculate discount
                    const discount = getDiscountPercentage(monthlyPrice, yearlyPrice);

                    // Determine features to display
                    const features = [
                        metadata.generatedImages === 'enterprise'
                            ? t('unlimited_images', { default: 'Unlimited banner images' })
                            : t('generate_images', { count: metadata.generatedImages, default: `Generate ${metadata.generatedImages} banner images` }),
                        t('image_editing', { level: metadata.imageEditor, default: `${metadata.imageEditor} image editing features` }),
                        t('support_level', { level: metadata.supportLevel, default: `${metadata.supportLevel} support` })
                    ];

                    // Determine CTA text and action
                    let ctaText = t('get_started');
                    if (isCurrentPlan) {
                        ctaText = t('current_plan', { default: 'Current Plan' });
                    } else if (userProduct) {
                        // If user has a subscription, show upgrade/downgrade
                        const currentProductIndex = sortedProducts.findIndex(p => p.id === userProduct?.id);
                        const thisProductIndex = sortedProducts.findIndex(p => p.id === product.id);
                        ctaText = thisProductIndex > currentProductIndex
                            ? t('upgrade', { default: 'Upgrade' })
                            : t('downgrade', { default: 'Downgrade' });
                    }

                    // Get the price to use for checkout - use monthly price
                    const priceForCheckout = product.prices.find(p => p.interval === 'month');

                    return (
                        <Card
                            key={product.id}
                            className={`flex flex-col h-full ${isPro ? "border-primary shadow-lg relative" : ""}`}
                        >
                            {isPro && (
                                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                    <Badge className="bg-primary hover:bg-primary">{t('most_popular', { default: 'Most Popular' })}</Badge>
                                </div>
                            )}
                            <CardHeader className={`${isPro ? "pt-6" : ""}`}>
                                <CardTitle>{product.name}</CardTitle>
                                <CardDescription>{product.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-3xl font-bold">
                                            {displayPrice
                                                ? `$${(displayPrice / 100).toFixed(2)}`
                                                : t('custom_price', { default: 'Custom' })}
                                        </span>
                                        {displayPrice && displayPrice > 0 && (
                                            <span className="text-muted-foreground ml-2">{t('per_month', { default: '/month' })}</span>
                                        )}
                                    </div>
                                    {monthlyPrice && yearlyPrice && discount > 0 && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t('save')} {discount}% {t('annual', { default: 'annual' }).toLowerCase()}
                                        </p>
                                    )}
                                </div>

                                <ul className="space-y-3">
                                    {features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <TooltipProvider>
                                    {priceForCheckout && typeof createCheckoutAction === 'function' && !isCurrentPlan ? (
                                        <form action={async () => {
                                            'use server';
                                            await createCheckoutAction({ price: priceForCheckout });
                                        }}>
                                            <Button
                                                className="w-full"
                                                type="submit"
                                            >
                                                {ctaText}
                                            </Button>
                                        </form>
                                    ) : (
                                        <Button
                                            variant={isCurrentPlan ? "outline" : "default"}
                                            className={`w-full ${isCurrentPlan ? "cursor-default" : ""}`}
                                            disabled={isCurrentPlan}
                                            asChild={!isCurrentPlan && !priceForCheckout}
                                        >
                                            {isCurrentPlan ? (
                                                <div className="flex items-center">
                                                    {ctaText}
                                                    {nextBillingDate && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{t('next_billing_date', { default: 'Next billing date' })}: {nextBillingDate}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            ) : !priceForCheckout ? (
                                                <a href="/contact">{t('contact_sales', { default: 'Contact Sales' })}</a>
                                            ) : (
                                                ctaText
                                            )}
                                        </Button>
                                    )}
                                </TooltipProvider>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-12 text-center">
                <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto">
                    <h3 className="text-lg font-medium mb-2">{t('custom_plan_title', { default: 'Need a custom plan?' })}</h3>
                    <p className="text-muted-foreground mb-4">
                        {t('custom_plan_description', { default: 'Contact our sales team for a tailored solution that meets your specific requirements.' })}
                    </p>
                    <Button variant="outline" asChild>
                        <a href="/contact">{t('contact_sales', { default: 'Contact Sales' })}</a>
                    </Button>
                </div>
            </div>
        </div>
    );
} 