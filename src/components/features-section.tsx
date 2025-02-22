"use client"

import { BarChart3, Puzzle, Shield } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
    return (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
                <CardContent className="p-6 space-y-2">
                    <Shield className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">Enterprise Security</h3>
                    <p className="text-sm text-muted-foreground">
                        GDPR compliant, with advanced security features and complete data control.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6 space-y-2">
                    <Puzzle className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">Easy Integration</h3>
                    <p className="text-sm text-muted-foreground">
                        Connect with your existing tools and software in minutes, not months.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6 space-y-2">
                    <BarChart3 className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">Clear ROI</h3>
                    <p className="text-sm text-muted-foreground">
                        Transparent pricing and measurable results for your business.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 