"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from 'next-intl'

interface CountdownTimerProps {
    expiresAt?: number | null; // Unix timestamp in seconds
}

export function CountdownTimer({ expiresAt }: CountdownTimerProps) {
    const pathname = usePathname()
    const t = useTranslations('countdown')

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        // Calculate initial time left
        if (expiresAt) {
            calculateTimeLeft(expiresAt);
        } else {
            // Default countdown of 7 days if no expiration date
            const defaultExpiration = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
            calculateTimeLeft(defaultExpiration);
        }

        function calculateTimeLeft(timestamp: number) {
            const now = Math.floor(Date.now() / 1000);
            const difference = timestamp - now;

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (60 * 60 * 24));
            const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((difference % (60 * 60)) / 60);
            const seconds = Math.floor(difference % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        }

        const timer = setInterval(() => {
            if (expiresAt) {
                calculateTimeLeft(expiresAt);
            } else {
                // Default countdown logic
                setTimeLeft((current) => {
                    if (current.days === 0 && current.hours === 0 && current.minutes === 0 && current.seconds === 0) {
                        clearInterval(timer);
                        return current;
                    }

                    let newSeconds = current.seconds - 1;
                    let newMinutes = current.minutes;
                    let newHours = current.hours;
                    let newDays = current.days;

                    if (newSeconds < 0) {
                        newSeconds = 59;
                        newMinutes = current.minutes - 1;
                    }
                    if (newMinutes < 0) {
                        newMinutes = 59;
                        newHours = current.hours - 1;
                    }
                    if (newHours < 0) {
                        newHours = 23;
                        newDays = current.days - 1;
                    }

                    return {
                        days: newDays,
                        hours: newHours,
                        minutes: newMinutes,
                        seconds: newSeconds,
                    };
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    if (pathname !== "/" || (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0))
        return null;

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

