'use client'

import { useEffect, useRef } from "react";
import { Message as MessageType } from "ai";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";

import { suggestedActions } from "../constants/suggested-actions";

import { MessageMarkdown } from "./message-markdown";
import { ToolInvocation } from "./tool-invocation";

interface ChatMessagesProps {
    messages: MessageType[];
    isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when new messages are added
    useEffect(() => {
        if (
            messages.length > 0 &&
            messagesEndRef.current &&
            containerRef.current
        ) {
            const lastMessage = messages[messages.length - 1];

            // Only smooth scroll for user messages
            const behavior = lastMessage.role === 'user' ? 'smooth' : 'auto';

            messagesEndRef.current.scrollIntoView({
                behavior,
                block: 'end'
            });
        }
    }, [messages.length, messages]);

    return (
        <div
            ref={containerRef}
            className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
            {messages.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-12"
                >
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                        Pica AI Assistant
                    </h1>
                    <p className="mt-4 text-neutral-400 max-w-sm">
                        Your AI-powered assistant with access to 100+ tools and integrations.
                        Ask anything or try the examples below.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-2xl">
                        {suggestedPrompts.map((prompt, index) => (
                            <Card
                                key={index}
                                className="p-4 cursor-pointer bg-neutral-900 hover:bg-neutral-800 transition-colors"
                                onClick={() => {
                                    // This function should be passed from parent if needed
                                    // or we could utilize a context/store to handle this
                                    console.log(`Prompt clicked: ${prompt.title}`);
                                }}
                            >
                                <h3 className="font-medium text-sm text-neutral-200">
                                    {prompt.title}
                                </h3>
                                <p className="text-xs text-neutral-400 mt-1">{prompt.description}</p>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-4">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * (index % 3) }}
                            className={cn(
                                'flex items-start gap-3 p-4 rounded-lg',
                                message.role === 'user'
                                    ? 'bg-neutral-800/50 self-end max-w-[80%]'
                                    : 'bg-neutral-900/50 self-start max-w-[80%]'
                            )}
                        >
                            <Avatar className={cn(
                                "h-8 w-8",
                                message.role === 'user' ? 'bg-blue-700' : 'bg-emerald-700'
                            )}>
                                {message.role === 'user' ? (
                                    <User className="h-5 w-5 text-white" />
                                ) : (
                                    <Bot className="h-5 w-5 text-white" />
                                )}
                            </Avatar>

                            <div className="flex flex-col gap-2">
                                {message.content && (
                                    <MessageMarkdown content={message.content} />
                                )}

                                {message.toolInvocations?.map((tool, i) => (
                                    <ToolInvocation key={i} tool={tool} />
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-start gap-3 p-4 rounded-lg bg-neutral-900/50 self-start max-w-[80%]"
                        >
                            <Avatar className="h-8 w-8 bg-emerald-700">
                                <Bot className="h-5 w-5 text-white" />
                            </Avatar>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-px" />
                </div>
            )}
        </div>
    );
}

// Suggested prompts for empty state
const suggestedPrompts = [
    {
        title: 'Send an email',
        description: 'Connect to Gmail and send an email to a colleague'
    },
    {
        title: 'Create a calendar event',
        description: 'Schedule a meeting in your Google Calendar'
    },
    {
        title: 'Search the web',
        description: 'Find information about any topic using Exa search'
    },
    {
        title: 'Database queries',
        description: 'Query your databases or CRMs for data'
    }
];