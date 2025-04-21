"use client"

import { useEffect, useRef } from "react"
import type { Message } from "ai"

import { saveChat } from "@/features/chat/actions/chat"
import { ChatMessage } from "@/features/chat/components/chat-message"
import { SuggestedActions } from "@/features/chat/components/suggested-actions"
import type { Chat } from "@/types/chat"
import { useChat } from "@ai-sdk/react"

interface ChatMessagesProps {
    chatId: string
    initialMessages: Message[]
}

export function ChatMessages({ chatId, initialMessages }: ChatMessagesProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    const { messages, append } = useChat({
        id: chatId,
        initialMessages,
        api: "/api/chat",
        onFinish: async (message) => {
            const chat: Omit<Chat, 'userId'> = {
                id: chatId,
                title: messages[0]?.content.substring(0, 100) || "New Chat",
                messages: [...messages, message],
                createdAt: new Date().toISOString(),
            }
            try {
                await saveChat(
                    chat as Chat
                )
            } catch (error) {
                console.error("Failed to save chat:", error);
            }
        },
    })

    // Scroll to bottom when messages change
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages])

    const handleSuggestedActionClick = (message: string) => {
        append({
            content: message,
            role: "user",
        })
    }

    return (
        <div
            ref={containerRef}
            className="fixed left-4 right-0 top-16 bottom-[80px] overflow-y-auto bg-[#f8f5f2] dark:bg-[#242525]"
            aria-label="Chat messages"
        >
            <div className="mx-auto max-w-[52rem] px-4">
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center pt-12">
                        <div className="px-4 py-10 text-center">
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">How can I help you today?</h1>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Ask me anything or start a conversation.</p>
                        </div>
                        <SuggestedActions messages={messages} onActionClick={handleSuggestedActionClick} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <ChatMessage key={index} message={message} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

