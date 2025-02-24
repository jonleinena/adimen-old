"use client"

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function SolutionPreview() {
    const t = useTranslations('solution_preview')

    return (
        <div className="mx-auto max-w-5xl rounded-lg border bg-muted/50 p-8">
            <Image
                src="/dashboard-preview.png"
                width={1200}
                height={600}
                alt={t('dashboard_alt')}
                className="rounded-lg shadow-lg"
            />
        </div>
    )
} 