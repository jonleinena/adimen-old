"use client"

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Button } from "@/components/ui/button"

export function CTASection() {
    const t = useTranslations('cta')

    return (
        <div className="mx-auto max-w-[58rem] space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t('title')}
            </h2>
            <p className="text-muted-foreground sm:text-lg">
                {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="blue" className="h-12" asChild>
                    <Link href="/signup">{t('free_trial')}</Link>
                </Button>
                <Button size="lg" variant="blueOutline" className="h-12" asChild>
                    <Link href="/contact">{t('talk_to_sales')}</Link>
                </Button>
            </div>
        </div>
    )
} 