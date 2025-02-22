"use client"

import { Building2, Check, Zap } from "lucide-react"

export function HowItWorks() {
    return (
        <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                    <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">1. Connect</h3>
                <p className="text-sm text-muted-foreground">
                    Link your existing tools and software with our secure connectors.
                </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                    <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">2. Configure</h3>
                <p className="text-sm text-muted-foreground">
                    Choose from pre-built workflows or customize your own with our visual editor.
                </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                    <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">3. Scale</h3>
                <p className="text-sm text-muted-foreground">
                    Deploy across your organization and watch productivity soar.
                </p>
            </div>
        </div>
    )
} 