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

}

export async function clearChat(id: string) {
    const user = await getUser()
    if (!user) {
        return
    }

    const redis = await getRedis()
    await redis.del(`chat:${id}`)
    await redis.zrem(getUserChatKey(user.id), `chat:${id}`)
}

export async function saveChat(chat: Chat) {
    const user = await getUser()
    if (!user) {
        throw new Error('User must be logged in to save a chat.')
    }

    try {
        const redis = await getRedis()
        const pipeline = redis.pipeline()

        const chatToSave = {
            ...chat,
            userId: user.id,
            messages: JSON.stringify(chat.messages)
        }

        pipeline.hmset(`chat:${chat.id}`, chatToSave)
        pipeline.zadd(getUserChatKey(user.id), Date.now(), `chat:${chat.id}`)

        const results = await pipeline.exec()

        return results
    } catch (error) {
        console.error("Error saving chat:", error)
        throw error
    }
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