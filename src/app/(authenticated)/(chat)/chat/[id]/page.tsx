import type { Metadata } from "next"

import { getUser } from "@/features/account/controllers/get-user"
import { getChat } from "@/features/chat/actions/chat"
import { ChatMessages } from "@/features/chat/components/chat-messages"
import { ChatPanel } from "@/features/chat/components/chat-pannel"
import type { Chat } from "@/types/chat"

export const metadata: Metadata = {
    title: "Chat",
    description: "Chat with AI using the Vercel AI SDK.",
}

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getUser()
    const userId = user?.id || "anonymous"

    const chatId = await params;

    let chat = await getChat(chatId.id, userId)

    if (!chat) {
        const newChat: Chat = {
            id: chatId.id,
            messages: [],
            createdAt: new Date().toISOString(),
            userId: userId
        }
        chat = newChat
    }

    return (
        <div className="flex-1 overflow-hidden">
            <ChatMessages chatId={chatId.id} initialMessages={chat.messages} />
            <ChatPanel chatId={chatId.id} />
        </div>
    )
}

