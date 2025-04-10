"use client"

import { useEffect, useRef, useState } from "react"
import { SendHorizontal } from "lucide-react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { saveChat } from "@/features/chat/actions/chat"
import { useChat } from "@ai-sdk/react"

import { AuthKitButton } from "./authkit-button"

interface ChatPanelProps {
    chatId: string
}

export function ChatPanel({ chatId }: ChatPanelProps) {
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const { messages, input, handleInputChange, handleSubmit, isLoading, status, stop } = useChat({
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

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

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
        <div className="fixed left-4 right-0 bottom-0 bg-white dark:bg-gray-900 dark:border-gray-800 py-4">
            <div className="mx-auto max-w-2xl px-4">
                <form
                    onSubmit={handleFormSubmit}
                    className="relative"
                >
                    <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
                        <Textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => {
                                handleInputChange(e)
                                setInputValue(e.target.value)
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={isLoading ? "Waiting for response..." : "Message..."}
                            className="min-h-[60px] max-h-[300px] w-full resize-none border-0 bg-transparent py-3.5 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                            rows={1}
                            disabled={isLoading}
                            id="message-input"
                        />
                        <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-xs text-muted-foreground">
                                AI may produce inaccurate information
                            </span>
                            <div className="flex items-center gap-2">
                                <AuthKitButton />
                                <Button
                                    type="submit"
                                    disabled={isLoading || !inputValue.trim()}
                                    className="rounded-full h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
                                    size="icon"
                                >
                                    <SendHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

