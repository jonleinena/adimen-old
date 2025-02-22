"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { cn } from "@/utils/cn"

const features = [
    "Workflow Automation with AI Agents",
    "Legacy Software Integration",
    "Custom AI Agent Development",
    "Process Optimization & Analytics",
    "Secure Data Management",
]

export function FeatureSelector() {
    const [selected, setSelected] = useState<string[]>([])

    const toggleFeature = (feature: string) => {
        setSelected((current) =>
            current.includes(feature)
                ? current.filter((f) => f !== feature)
                : [...current, feature]
        )
    }

    return (
        <div className="space-y-4 rounded-lg bg-background/50 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold">What would you like to improve?</h3>
            <div className="space-y-2">
                {features.map((feature) => (
                    <button
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className={cn(
                            "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors",
                            selected.includes(feature)
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                        )}
                    >
                        <span>{feature}</span>
                        {selected.includes(feature) && <Check className="h-5 w-5 text-primary" />}
                    </button>
                ))}
            </div>
        </div>
    )
} 