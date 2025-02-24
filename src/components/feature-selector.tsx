"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'

import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"

export function FeatureSelector() {
    const [selected, setSelected] = useState<string[]>([])
    const router = useRouter()
    const t = useTranslations('feature_selector')

    const features = t.raw('features') as string[]

    const toggleFeature = (feature: string) => {
        setSelected((current) =>
            current.includes(feature)
                ? current.filter((f) => f !== feature)
                : [...current, feature]
        )
    }

    return (
        <div className="space-y-4 rounded-lg bg-background/50 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold">{t('heading')}</h3>
            <div className="space-y-2">
                {features.map((feature) => (
                    <label
                        key={feature}
                        className={cn(
                            "flex w-full items-center rounded-lg border p-4 transition-colors cursor-pointer",
                            selected.includes(feature)
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                        )}
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(feature)}
                            onChange={() => toggleFeature(feature)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-4"
                        />
                        <span>{feature}</span>
                    </label>
                ))}
            </div>
            <Button
                onClick={() => router.push('/contact')}
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium"
            >
                {t('continue_button')}
            </Button>
        </div>
    )
} 