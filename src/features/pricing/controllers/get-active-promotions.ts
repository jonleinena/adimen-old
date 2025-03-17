import { stripeAdmin } from '@/libs/stripe/stripe-admin';

/**
 * Represents a promotion with details for display
 */
export interface PromotionDetails {
    exists: boolean;
    percentOff?: number;
    amountOff?: number;
    currency?: string;
    durationInMonths?: number | null;
    code?: string;
    expiresAt?: number | null; // Unix timestamp for expiration (if any)
}

/**
 * Gets active promotion details from Stripe
 * 
 * This function checks both promotion codes and standalone coupons in Stripe
 * and returns the most favorable option for the customer based on the following priority:
 * 1. Higher percentage discount takes precedence
 * 2. If no percentage discounts, higher amount discount takes precedence
 * 3. If equal, promotion codes take precedence over standalone coupons
 * 
 * @returns Promotion details if any active promotions exist
 */
export async function getActivePromotions(): Promise<PromotionDetails> {
    try {
        // Get all active promotion codes
        const promotionCodes = await stripeAdmin.promotionCodes.list({
            active: true,
            expand: ['data.coupon'],
            limit: 100, // Get a reasonably large number to compare
        });

        // Get all coupons
        const coupons = await stripeAdmin.coupons.list({
            limit: 100, // Get a reasonably large number to compare
        });

        // Valid coupons with no associated promotion code
        const standaloneCoupons = coupons.data.filter(coupon =>
            coupon.valid &&
            !promotionCodes.data.some(pc => pc.coupon.id === coupon.id)
        );

        // Combine all valid promotion options
        const allPromotions: Array<{
            percentOff?: number;
            amountOff?: number;
            currency?: string;
            durationInMonths?: number | null;
            code?: string;
            expiresAt?: number | null;
            isPromotionCode: boolean;
        }> = [
                // Add promotion codes
                ...promotionCodes.data.map(pc => ({
                    percentOff: pc.coupon.percent_off || undefined,
                    amountOff: pc.coupon.amount_off || undefined,
                    currency: pc.coupon.currency || undefined,
                    durationInMonths: pc.coupon.duration === 'repeating' ? pc.coupon.duration_in_months : null,
                    code: pc.code,
                    expiresAt: pc.expires_at || pc.coupon.redeem_by || null,
                    isPromotionCode: true,
                })),
                // Add standalone coupons
                ...standaloneCoupons.map(coupon => ({
                    percentOff: coupon.percent_off || undefined,
                    amountOff: coupon.amount_off || undefined,
                    currency: coupon.currency || undefined,
                    durationInMonths: coupon.duration === 'repeating' ? coupon.duration_in_months : null,
                    expiresAt: coupon.redeem_by || null,
                    isPromotionCode: false,
                })),
            ];

        if (allPromotions.length === 0) {
            return { exists: false };
        }

        // Sort promotions to find the best one (higher percent off or amount off is better)
        allPromotions.sort((a, b) => {
            // Percent off has precedence over amount off
            if (a.percentOff && b.percentOff) {
                return b.percentOff - a.percentOff; // Higher percent off is better
            }

            if (a.percentOff) return -1; // a has percent off, b doesn't, so a is better
            if (b.percentOff) return 1;  // b has percent off, a doesn't, so b is better

            // Compare amount off (assuming same currency, which is a simplification)
            if (a.amountOff && b.amountOff) {
                return b.amountOff - a.amountOff; // Higher amount off is better
            }

            if (a.amountOff) return -1; // a has amount off, b doesn't, so a is better
            if (b.amountOff) return 1;  // b has amount off, a doesn't, so b is better

            // Prefer promotion codes over standalone coupons
            return a.isPromotionCode ? -1 : 1;
        });

        // Take the best promotion
        const bestPromotion = allPromotions[0];

        return {
            exists: true,
            percentOff: bestPromotion.percentOff,
            amountOff: bestPromotion.amountOff,
            currency: bestPromotion.currency,
            durationInMonths: bestPromotion.durationInMonths,
            code: bestPromotion.code,
            expiresAt: bestPromotion.expiresAt,
        };
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return { exists: false }; // Default to no promotions on error
    }
} 