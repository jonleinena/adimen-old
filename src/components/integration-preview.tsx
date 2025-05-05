"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
// Define popular office tools with their positions
const officeTools = [
    { name: "Microsoft Word", logo: "/logos/word.png", x: "30%", y: "25%" },
    { name: "Excel", logo: "/logos/excel.png", x: "45%", y: "15%" },
    { name: "Outlook", logo: "/logos/outlook.png", x: "35%", y: "40%" },
    { name: "Slack", logo: "/logos/slack.png", x: "60%", y: "35%" },
    { name: "Zoom", logo: "/logos/zoom.png", x: "30%", y: "55%" },
    { name: "Google Drive", logo: "/logos/drive.png", x: "45%", y: "45%" },
    { name: "Trello", logo: "/logos/trello.png", x: "65%", y: "17%" },
    { name: "Calendar", logo: "/logos/calendar.png", x: "70%", y: "50%" },
    { name: "Box", logo: "/logos/box.png", x: "50%", y: "30%" },
]

export function IntegrationPreview() {
    const t = useTranslations('integration_preview')

    return (
        <div className="relative h-[650px] w-full">
            {/* Floating app logos */}
            <div className="h-[600px] w-full overflow-hidden relative">
                {officeTools.map((tool, i) => (
                    <motion.div
                        key={tool.name}
                        className="absolute"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            y: [-10, 0, 0, 10],
                        }}
                        transition={{
                            duration: 5,
                            times: [0, 0.2, 0.8, 1],
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.4,
                            ease: "easeInOut",
                        }}
                        style={{
                            left: tool.x,
                            top: tool.y,
                        }}
                    >
                        <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm transition-shadow duration-200 hover:shadow-md">
                            <div className="h-8 w-8 relative">
                                <Image
                                    src={tool.logo}
                                    alt={`${t('tool_logo', { name: tool.name })}`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{tool.name}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Subtle CTA at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] px-8 py-6 max-w-md grid place-items-center gap-2 text-sm">
                    <h2 className="text-2xl font-bold text-center">{t('cta_heading')}</h2>
                    <div className="flex justify-center">
                        <Button
                            className="bg-blue-500 text-white hover:bg-blue-600"
                        >
                            <Link href="/contact">
                                {t('request_integration')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )
} 