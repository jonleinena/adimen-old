"use client"

import { useTranslations } from 'next-intl'
import { Building2, Check, Zap } from "lucide-react"

export function HowItWorks() {
    const t = useTranslations('how_it_works')

    return (
        <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                    <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t('step1.title')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('step1.description')}
                </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                    <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t('step2.title')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('step2.description')}
                </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                    <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t('step3.title')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('step3.description')}
                </p>
            </div>
        </div>
    )
} 