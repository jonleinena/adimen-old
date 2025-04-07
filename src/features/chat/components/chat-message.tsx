import type { Message } from "ai"
import { Bot, User } from "lucide-react"

import { Markdown } from "@/components/markdown"
import { cn } from "@/utils/cn"

interface ChatMessageProps {
    message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div
            className={cn("flex items-start gap-4 rounded-lg p-4", message.role === "user" ? "bg-muted/50" : "bg-background")}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
            >
                {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className="flex-1 space-y-2 overflow-hidden">
                <div className="prose prose-sm dark:prose-invert break-words">
                    <Markdown>{message.content}</Markdown>
                </div>
            </div>
        </div>
    )
}

