"use client"

import { useTranslations } from 'next-intl'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
    const t = useTranslations('faq');

    return (
        <div className="mx-auto max-w-3xl w-full">
            <Accordion type="single" collapsible className="w-full">
                {t.raw('items').map((faq: { question: string; answer: string }, index: number) => (
                    <AccordionItem key={index} value={`item-${index}`} className="w-full">
                        <AccordionTrigger className="text-left w-full">{faq.question}</AccordionTrigger>
                        <AccordionContent className="w-full">{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

