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
        <div className="border-t bg-background p-4">
            <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => {
                        handleInputChange(e)
                        setInputValue(e.target.value)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="min-h-12 resize-none"
                    rows={1}
                />
                <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                    <SendHorizontal className="h-5 w-5" />
                    <span className="sr-only">Send message</span>
                </Button>
            </form>
        </div>
    )
}

