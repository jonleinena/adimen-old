import Image from "next/image"
import { useTranslations } from 'next-intl'

export function AICompanyLogos() {
    const t = useTranslations('ai_logos')

    const logos = [
        { src: "/OpenAI-Logo-2022.png", alt: "openai" },
        { src: "/Anthropic_logo.png", alt: "anthropic" },
        { src: "/DeepMind_new_logo.png", alt: "deepmind" },
        { src: "/Vercel-Logo.jpg", alt: "vercel" },
        { src: "/cohere-logo-color-rgb-1.png", alt: "cohere" }
    ]

    return (
        <div className="container px-4">
            <div className="relative mt-12">
                <div className="flex animate-[slide_25s_linear_infinite] items-center justify-center gap-12 md:gap-16">
                    <div className="flex min-w-full items-center justify-around">
                        {logos.map((logo, index) => (
                            <div key={index} className="w-[140px] flex-none">
                                <Image
                                    src={logo.src}
                                    alt={t(`${logo.alt}_alt`)}
                                    width={140}
                                    height={48}
                                    className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Duplicate set for seamless loop */}
                    <div className="flex min-w-full items-center justify-around">
                        {logos.map((logo, index) => (
                            <div key={`duplicate-${index}`} className="w-[140px] flex-none">
                                <Image
                                    src={logo.src}
                                    alt={t(`${logo.alt}_alt`)}
                                    width={140}
                                    height={48}
                                    className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

