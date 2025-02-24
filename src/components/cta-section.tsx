"use client"

import Link from 'next/link'

import { Button } from "@/components/ui/button"

export function CTASection() {
    return (
        <div className="mx-auto max-w-[58rem] space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground sm:text-lg">
                Join hundreds of SMEs already using Adimen to stay competitive.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="blue" className="h-12" asChild>
                    <Link href="/signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="blueOutline" className="h-12" asChild>
                    <Link href="/contact">Talk to Sales</Link>
                </Button>
            </div>
        </div>
    )
} 