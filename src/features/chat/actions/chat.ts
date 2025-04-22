'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getUser } from '@/features/account/controllers/get-user'
import { getRedisClient, RedisWrapper } from '@/features/chat/redis/config'
import { type Chat } from '@/types/chat'

async function getRedis(): Promise<RedisWrapper> {
    return await getRedisClient()
}

const CHAT_VERSION = 'v2'
function getUserChatKey(userId: string) {
    return `user:${CHAT_VERSION}:chat:${userId}`
}

export async function getChats() {
    const user = await getUser()
    if (!user) {
        return []
    }

    try {
        const redis = await getRedis()
        const chats = await redis.zrange(getUserChatKey(user.id), 0, -1, {
            rev: true
        })

        if (chats.length === 0) {
            return []
        }

        const results = await Promise.all(
            chats.map(async chatKey => {
                const chat = await redis.hgetall(chatKey)
                return chat
            })
        )

        return results
            .filter((result): result is Record<string, any> => {
                if (result === null || Object.keys(result).length === 0) {
                    return false
                }
                return true
            })
            .map(chat => {
                const plainChat = { ...chat }
                if (typeof plainChat.messages === 'string') {
                    try {
                        plainChat.messages = JSON.parse(plainChat.messages)
                    } catch (error) {
                        plainChat.messages = []
                    }
                }
                if (plainChat.createdAt && !(plainChat.createdAt instanceof Date)) {
                    plainChat.createdAt = new Date(plainChat.createdAt)
                }
                return plainChat as Chat
            })
    } catch (error) {
        console.error("Error fetching chats:", error)
        return []
    }
}

export async function getChat(id: string) {
    const user = await getUser()
    if (!user) {
        return null
    }

    const redis = await getRedis()
    const rawChat = await redis.hgetall<Record<string, unknown>>(`chat:${id}`)

    if (!rawChat) {
        return null
    }

    if (rawChat.userId !== user.id) {
        console.warn(`User ${user.id} attempted to access chat ${id} owned by ${rawChat.userId}`)
        return null
    }

    const chat = rawChat as unknown as Chat

    if (typeof chat.messages === 'string') {
        try {
            chat.messages = JSON.parse(chat.messages)
        } catch (error) {
            chat.messages = []
        }
    }

    if (!Array.isArray(chat.messages)) {
        chat.messages = []
    }

    return chat
}

export async function clearChats(): Promise<void> {
    const user = await getUser()
    if (!user) {
        console.warn("Attempted to clear chats without authentication.")
        redirect('/login')
        return
    }

    const redis = await getRedis()
    const userChatKey = getUserChatKey(user.id)
    const chats = await redis.zrange(userChatKey, 0, -1)
    if (!chats.length) {
        console.log(`No chats found for user ${user.id} to clear.`)
        return
    }
    const pipeline = redis.pipeline()

    for (const chat of chats) {
        pipeline.del(chat)
        pipeline.zrem(userChatKey, chat)
    }

    await pipeline.exec()

    // Add revalidation
    revalidatePath('/chat')
}

export async function clearChat(id: string) {
    const user = await getUser()
    if (!user) {
        return
    }

    const redis = await getRedis()
    const chatKey = `chat:${id}` // Define chatKey for checking ownership

    // Optional: Verify ownership before deleting
    const ownerId = await redis.hget(chatKey, 'userId')
    if (!ownerId || ownerId !== user.id) {
        console.warn(`User ${user.id} attempt to delete chat ${id} failed ownership check.`)
        // Decide if you want to return silently or throw an error
        return // Or throw new Error("Permission denied")
    }

    await redis.del(chatKey)
    await redis.zrem(getUserChatKey(user.id), chatKey)

    // Add revalidation
    revalidatePath('/chat')
    // Also revalidate the specific chat page in case someone is viewing it
    revalidatePath(`/chat/${id}`)
}

export async function saveChat(chat: Chat) {
    const user = await getUser()
    if (!user) {
        throw new Error('User must be logged in to save a chat.')
    }

    try {
        const redis = await getRedis()
        const pipeline = redis.pipeline()
        const chatKey = `chat:${chat.id}` // Use consistent key naming

        const chatToSave = {
            ...chat,
            userId: user.id,
            messages: JSON.stringify(chat.messages)
        }

        pipeline.hmset(chatKey, chatToSave)
        pipeline.zadd(getUserChatKey(user.id), Date.now(), chatKey)

        const results = await pipeline.exec()

        // Add revalidation after successful save
        revalidatePath('/chat')
        // Revalidate the specific chat page as well
        revalidatePath(`/chat/${chat.id}`)

        return results
    } catch (error) {
        console.error("Error saving chat:", error)
        throw error // Rethrow to indicate failure
    }
}

export async function updateChatTitle(id: string, title: string): Promise<Chat | null> {
    const user = await getUser()
    if (!user) {
        console.warn("Attempted to update chat title without authentication.")
        return null // Or throw an error
    }

    const redis = await getRedis()
    const chatKey = `chat:${id}`
    const chatExists = await redis.exists(chatKey)

    if (!chatExists) {
        console.warn(`Chat with id ${id} not found for title update.`)
        return null
    }

    // Verify ownership before updating
    const ownerId = await redis.hget(chatKey, 'userId')
    if (ownerId !== user.id) {
        console.warn(`User ${user.id} attempted to update title of chat ${id} owned by ${ownerId}`)
        return null // Or throw an error
    }

    // Update the title
    await redis.hset(chatKey, 'title', title)

    // Optionally, fetch and return the updated chat data
    const updatedChatData = await redis.hgetall<Record<string, unknown>>(chatKey)

    if (!updatedChatData) {
        return null // Should not happen if hset succeeded, but good practice
    }

    // Reconstruct the chat object (similar to getChat)
    const chat = updatedChatData as unknown as Chat
    if (typeof chat.messages === 'string') {
        try {
            chat.messages = JSON.parse(chat.messages)
        } catch (error) {
            chat.messages = []
        }
    }
    if (!Array.isArray(chat.messages)) {
        chat.messages = []
    }

    // Revalidate the path for the specific chat page if necessary
    revalidatePath(`/chat/${id}`)
    // Revalidate the base path to update the sidebar list potentially
    revalidatePath('/chat')

    return chat
}

export async function getSharedChat(id: string) {
    const redis = await getRedis()
    const rawChat = await redis.hgetall<Record<string, unknown>>(`chat:${id}`)

    if (!rawChat || !rawChat.sharePath) {
        return null
    }

    return rawChat as unknown as Chat
}

export async function shareChat(id: string) {
    const user = await getUser()
    if (!user) {
        return null
    }

    const redis = await getRedis()
    const rawChat = await redis.hgetall<Record<string, unknown>>(`chat:${id}`)

    if (!rawChat || rawChat.userId !== user.id) {
        return null
    }

    const payload = {
        ...rawChat,
        sharePath: `/share/${id}`
    } as Chat

    await redis.hmset(`chat:${id}`, payload)
    return payload
}