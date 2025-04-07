"use client"

import { useEffect, useRef } from "react"
import type { Message } from "ai"
import { useChat } from "ai/react"
import { useUser } from "@/features/account/hooks/use-user"

import { saveChat } from "@/features/chat/actions/chat"
import { ChatMessage } from "@/features/chat/components/chat-message"

import type { Chat } from "@/types/chat"
interface ChatMessagesProps {
    chatId: string
    initialMessages: Message[]
}

export function ChatMessages({ chatId, initialMessages }: ChatMessagesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { user, loading: userLoading } = useUser();

    const { messages } = useChat({
        id: chatId,
        initialMessages,
        api: "/api/chat",
        onFinish: async (message) => {
            if (userLoading) {
                console.log("Waiting for user data before saving chat...");
                return;
            }

            const userId = user?.id || "anonymous"

            const chat: Chat = {
                id: chatId,
                title: messages[0]?.content.substring(0, 100) || "New Chat",
                messages: [...messages, message],
                createdAt: new Date().toISOString(),
                userId,
            }
            try {
                await saveChat(
                    chat,
                    userId,
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

    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto pb-32" aria-label="Chat messages">
            {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <div className="px-4 py-10 text-center sm:px-6 md:px-24 lg:px-32 xl:px-48">
                        <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-100">How can I help you today?</h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Ask me anything or start a conversation.</p>
                    </div>
                </div>
            ) : (
                messages.map((message, index) => <ChatMessage key={index} message={message} />)
            )}
        </div>
    )
}

