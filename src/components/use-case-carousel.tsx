"use client"

import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


export function UseCaseCarousel() {
    const t = useTranslations('use-case')
    const [currentIndex, setCurrentIndex] = useState(0)

    const useCases = t.raw('cases') as Array<{
        company: string;
        industry: string;
        title: string;
        description: string;
        metrics: Record<string, string>;
    }>

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((current) => (current + 1) % useCases.length)
        }, 5000)
        return () => clearInterval(timer)
    })

    const nextSlide = () => {
        setCurrentIndex((current) => (current + 1) % useCases.length)
    }

    const prevSlide = () => {
        setCurrentIndex((current) => (current - 1 + useCases.length) % useCases.length)
    }

    const currentCase = useCases[currentIndex]

    return (
        <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
                {/* Video Side */}
                <div className="relative aspect-video rounded-lg bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Button variant="outline" size="icon" className="h-16 w-16 rounded-full bg-background/90 shadow-lg">
                            <Play className="h-8 w-8" />
                        </Button>
                    </div>
                    <div className="absolute bottom-4 right-4 rounded-full bg-background/90 px-4 py-2 text-sm">02:45</div>
                </div>

                {/* Content Side */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-muted-foreground">{currentCase.industry}</p>
                                <div className="flex gap-1">
                                    {useCases.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 w-6 rounded-full ${idx === currentIndex ? "bg-primary" : "bg-muted"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold">{currentCase.company}</h3>
                            <p className="text-lg font-semibold text-primary">{currentCase.title}</p>
                        </div>

                        <p className="text-muted-foreground">{currentCase.description}</p>

                        <div className="grid grid-cols-3 gap-4">
                            {Object.entries(currentCase.metrics).map(([key, value]) => (
                                <div key={key} className="space-y-1">
                                    <p className="text-2xl font-bold text-primary">{value}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 md:-left-12">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={prevSlide}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 md:-right-12">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={nextSlide}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

