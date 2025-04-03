import { CoreMessage, JSONValue, Message } from 'ai'

// Define our own message type to avoid conflicts with Vercel AI SDK
export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system' | 'function' | 'data'
    content: string
    createdAt?: Date
    toolInvocations?: ChatToolCall[]
}

// Our own tool call type to match what we receive from the API
export interface ChatToolCall {
    id: string
    name: string
    args: any
    output?: any
    state?: string
    step?: number
}

// For persisted chats
export interface Chat extends Record<string, any> {
    id: string
    title: string
    createdAt: Date
    userId: string
    path: string
    messages: ChatMessage[]
    sharePath?: string
}

// Conversion utility to transform between types
export function convertToChatMessages(messages: Message[]): ChatMessage[] {
    return messages.map(message => {
        // Create a ChatMessage from a Vercel AI SDK Message
        const chatMessage: ChatMessage = {
            id: message.id,
            role: message.role as 'user' | 'assistant' | 'system' | 'function' | 'data',
            content: message.content,
            // Map toolInvocations from the message if they exist
            toolInvocations: []
        }

        // Access toolInvocations from the message object and map them to our format
        const toolInvocations = (message as any).toolInvocations || []
        if (toolInvocations.length > 0) {
            chatMessage.toolInvocations = toolInvocations.map((tool: any) => ({
                id: tool.id || '',
                name: tool.name || '',
                args: tool.args || {},
                output: tool.output,
                state: tool.state || '',
                step: typeof tool.step === 'number' ? tool.step : undefined
            }))
        }

        return chatMessage
    })
}

// Convert from our chat format to Vercel AI SDK format
export function convertToAIMessages(messages: ChatMessage[]): Message[] {
    return messages.map(message => {
        // Need to filter out function/data roles as they're not supported in Vercel AI SDK
        const role = message.role === 'function' || message.role === 'data'
            ? 'assistant'
            : message.role

        // Create a base message object with the correct role type
        const aiMessage: any = {
            id: message.id,
            role: role as 'user' | 'assistant' | 'system',
            content: message.content
        }

        // Add toolInvocations if they exist
        if (message.toolInvocations && message.toolInvocations.length > 0) {
            aiMessage.toolInvocations = message.toolInvocations.map(tool => ({
                id: tool.id,
                name: tool.name,
                args: tool.args,
                output: tool.output,
                state: tool.state || 'result',
                step: tool.step
            }))
        }

        return aiMessage as Message
    })
}

// ExtendedCoreMessage for saveing annotations
export type ExtendedCoreMessage = Omit<CoreMessage, 'role' | 'content'> & {
    role: CoreMessage['role'] | 'data'
    content: CoreMessage['content'] | JSONValue
}