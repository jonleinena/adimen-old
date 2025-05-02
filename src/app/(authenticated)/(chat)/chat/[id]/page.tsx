import type { Metadata } from "next"

import { getUser } from "@/features/account/controllers/get-user"
import { getChat } from "@/features/chat/actions/chat"
import { ChatMessages } from "@/features/chat/components/chat-messages"
import { ChatPanel } from "@/features/chat/components/chat-pannel"
import { PricingModalServer } from "@/features/pricing/components/pricing-modal-server"
import type { Chat } from "@/types/chat"

export const metadata: Metadata = {
    title: "Chat",
    description: "Chat with AI using the Vercel AI SDK.",
}

export default async function ChatPage({
    params,
    searchParams
}: {
    params: { id: string };
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const user = await getUser()
    const userId = user?.id || "anonymous"

    const chatId = params.id;

    const resolvedSearchParams = await searchParams;

    let chat = await getChat(chatId)

    if (!chat) {
        const newChat: Chat = {
            id: chatId,
            messages: [],
            createdAt: new Date().toISOString(),
            userId: userId
        }
        chat = newChat
    }

    const showPricing = resolvedSearchParams?.showPricing === 'true';

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-x-hidden overflow-y-auto">
                    <ChatMessages chatId={chatId} initialMessages={chat.messages} />
                </div>
                <ChatPanel chatId={chatId} initialMessages={chat.messages} />
            </div>
            {showPricing && <PricingModalServer currentPath={`/chat/${chatId}`} />}
        </>
    )
}

