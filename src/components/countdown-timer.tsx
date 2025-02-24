"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from 'next-intl'

export function CountdownTimer() {
    const pathname = usePathname()
    const t = useTranslations('countdown')

    const [timeLeft, setTimeLeft] = useState({
        days: 6,
        hours: 23,
        minutes: 59,
        seconds: 58,
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((current) => {
                if (current.days === 0 && current.hours === 0 && current.minutes === 0 && current.seconds === 0) {
                    clearInterval(timer)
                    return current
                }

                let newSeconds = current.seconds - 1
                let newMinutes = current.minutes
                let newHours = current.hours
                let newDays = current.days

                if (newSeconds < 0) {
                    newSeconds = 59
                    newMinutes = current.minutes - 1
                }
                if (newMinutes < 0) {
                    newMinutes = 59
                    newHours = current.hours - 1
                }
                if (newHours < 0) {
                    newHours = 23
                    newDays = current.days - 1
                }

                return {
                    days: newDays,
                    hours: newHours,
                    minutes: newMinutes,
                    seconds: newSeconds,
                }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    if (pathname !== "/") return null

    return (
        <div className="flex gap-4 text-center">
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary-foreground">{timeLeft.days}</span>
                <span className="text-xs text-muted-primary-foreground">{t('days')}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary-foreground">{timeLeft.hours}</span>
                <span className="text-xs text-muted-primary-foreground">{t('hours')}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary-foreground">{timeLeft.minutes}</span>
                <span className="text-xs text-muted-primary-foreground">{t('minutes')}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary-foreground">{timeLeft.seconds}</span>
                <span className="text-xs text-muted-primary-foreground">{t('seconds')}</span>
            </div>
        </div>
    )
}

