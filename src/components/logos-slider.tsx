import Image from "next/image"

export function AICompanyLogos() {
    return (
        <div className="container px-4">
            <div className="relative mt-12">
                <div className="flex animate-[slide_25s_linear_infinite] items-center justify-center gap-12 md:gap-16">
                    <div className="flex min-w-full items-center justify-around">
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/OpenAI-Logo-2022.png"
                                alt="OpenAI Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/Anthropic_logo.png"
                                alt="Anthropic Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/DeepMind_new_logo.png"
                                alt="Google AI Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/Vercel-Logo.jpg"
                                alt="Vercel Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/cohere-logo-color-rgb-1.png"
                                alt="Cohere Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                    </div>
                    {/* Duplicate set for seamless loop */}
                    <div className="flex min-w-full items-center justify-around">
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/OpenAI-Logo-2022.png"
                                alt="OpenAI Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/Anthropic_logo.png"
                                alt="Anthropic Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/DeepMind_new_logo.png"
                                alt="Google AI Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/Vercel-Logo.jpg"
                                alt="Vercel Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                        <div className="w-[140px] flex-none">
                            <Image
                                src="/cohere-logo-color-rgb-1.png"
                                alt="Cohere Logo"
                                width={140}
                                height={48}
                                className="opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

