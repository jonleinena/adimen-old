"use client"

import Image from 'next/image'

export function SolutionPreview() {
    return (
        <div className="mx-auto max-w-5xl rounded-lg border bg-muted/50 p-8">
            <Image
                src="/dashboard-preview.png"
                width={1200}
                height={600}
                alt="Adimen Dashboard Preview"
                className="rounded-lg shadow-lg"
            />
        </div>
    )
} 