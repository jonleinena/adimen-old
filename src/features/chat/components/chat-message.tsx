import type { Message } from "ai"
import { Bot, User } from "lucide-react"

import { Markdown } from "@/components/markdown"
import { cn } from "@/utils/cn"

interface ChatMessageProps {
    message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user"

    return (
        <div
            className={cn(
                "group relative mx-auto flex w-full items-start px-4 md:max-w-3xl lg:max-w-4xl xl:max-w-6xl",
                isUser ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900/30",
            )}
        >
            <div className="flex w-full py-6 text-sm md:px-5">
                <div className="mr-4 flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
                    {isUser ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex-1 space-y-2 overflow-hidden px-1">
                    <div
                        className={cn(
                            "prose prose-sm max-w-none dark:prose-invert",
                            "prose-p:leading-relaxed prose-pre:p-0",
                            "break-words",
                        )}
                    >
                        <Markdown>{message.content}</Markdown>
                    </div>
                </div>
            </div>
        </div>
    )
}

