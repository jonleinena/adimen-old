"use client"

import { useTranslations } from 'next-intl'
import { BarChart3, Puzzle, Shield } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
    const t = useTranslations('features_section')

    return (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
                <CardContent className="p-6 space-y-2">
                    <Shield className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">{t('security.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t('security.description')}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6 space-y-2">
                    <Puzzle className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">{t('integration.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t('integration.description')}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6 space-y-2">
                    <BarChart3 className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">{t('roi.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t('roi.description')}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 