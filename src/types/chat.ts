import type { Message } from "ai"

export interface Chat {
    id: string
    title?: string
    messages: Message[]
    createdAt: string
    userId?: string
    sharePath?: string
    [key: string]: unknown
}

