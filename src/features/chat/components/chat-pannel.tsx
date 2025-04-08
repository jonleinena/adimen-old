"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { SendHorizontal } from "lucide-react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { saveChat } from "@/features/chat/actions/chat"

interface ChatPanelProps {
    chatId: string
}

export function ChatPanel({ chatId }: ChatPanelProps) {
    const [inputValue, setInputValue] = useState("")
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        id: chatId,
        api: "/api/chat",
        onFinish: async (message) => {
            // Save the chat after each message
            await saveChat(
                {
                    id: chatId,
                    title: messages[0]?.content.substring(0, 100) || "New Chat",
                    messages: [...messages, message],
                    createdAt: new Date().toISOString(),
                }
            )
        },
    })

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (inputValue.trim()) {
            handleSubmit(e)
            setInputValue("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            const form = e.currentTarget.form
            if (form) form.requestSubmit()
        }
    }

    return (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white from-50% to-transparent pb-8 pt-6 dark:from-gray-800">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center space-y-4 px-4 sm:px-6 md:px-8">
                <form
                    onSubmit={handleFormSubmit}
                    className="relative flex w-full max-w-3xl items-center rounded-xl border bg-white p-1 shadow-sm focus-within:ring-1 focus-within:ring-primary dark:bg-gray-700"
                >
                    <Textarea
                        value={input}
                        onChange={(e) => {
                            handleInputChange(e)
                            setInputValue(e.target.value)
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Message..."
                        className="min-h-12 max-h-36 flex-1 resize-none border-0 bg-transparent py-3 px-3 focus-visible:ring-0"
                        rows={1}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        disabled={isLoading || !inputValue.trim()}
                        className="absolute right-2 h-8 w-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <SendHorizontal className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </form>
                <p className="text-xs text-muted-foreground">
                    AI may produce inaccurate information about people, places, or facts.
                </p>
            </div>
        </div>
    )
}

