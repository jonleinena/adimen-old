"use client"

import { useEffect, useRef } from "react"
import type { Message } from "ai"
import { useChat } from "ai/react"

import { saveChat } from "@/features/chat/actions/chat"
import { ChatMessage } from "@/features/chat/components/chat-message"

interface ChatMessagesProps {
    chatId: string
    initialMessages: Message[]
}

export function ChatMessages({ chatId, initialMessages }: ChatMessagesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { messages } = useChat({
        id: chatId,
        initialMessages,
        api: "/api/chat",
        onFinish: async (message) => {
            // Save the chat after each message
            const userId = localStorage.getItem("userId") || "anonymous"
            await saveChat(
                {
                    id: chatId,
                    title: messages[0]?.content.substring(0, 100) || "New Chat",
                    messages: [...messages, message],
                    createdAt: new Date().toISOString(),
                    userId,
                },
                userId,
            )
        },
    })

    // Scroll to bottom when messages change
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <p className="text-center text-lg text-muted-foreground">Start a conversation by typing a message below.</p>
                </div>
            ) : (
                messages.map((message, index) => <ChatMessage key={index} message={message} />)
            )}
        </div>
    )
}

