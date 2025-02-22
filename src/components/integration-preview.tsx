"use client"

import Image from 'next/image'

export function IntegrationPreview() {
    return (
        <div className="relative">
            <div className="flex gap-6 animate-scroll">
                <Image
                    src="/integration-preview.jpg"
                    alt="Integration Preview"
                    width={600}
                    height={400}
                    className="rounded-lg border shadow-lg"
                />
                {/* Add more integration previews as needed */}
            </div>
        </div>
    )
} 