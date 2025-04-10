"use client"

import { Message } from "ai"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"

import { Markdown } from "@/components/markdown"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ExecuteCard, { ExecuteResult } from "@/components/ui/execute-card"
import KnowledgeCard from "@/components/ui/knowledge-card"
import { cn } from "@/utils/cn"

interface ChatMessageProps {
    message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user"

    // Process tool invocations if they exist
    const processToolInvocations = () => {
        if (!message.toolInvocations || message.toolInvocations.length === 0) {
            return null;
        }

        // Collect all actions and knowledge from tool invocations
        const allActions = message.toolInvocations.reduce((acc, toolInvocation) => {
            const { toolName, state } = toolInvocation as any;
            const result = (toolInvocation as any).result;

            if (state === "result") {
                // For execute actions, collect them all (successful and failed)
                if (toolName === "execute" && result) {
                    if (!acc.executeResults) {
                        acc.executeResults = [];
                    }
                    acc.executeResults.push(result);
                }
                // For getAvailableActions, collect actions by platform
                if (toolName === "getAvailableActions" && result?.actions) {
                    const platform = result.platform?.toLowerCase() || 'unknown';
                    if (!acc.platforms[platform]) {
                        acc.platforms[platform] = {
                            name: result.platform || '',
                            actions: []
                        };
                    }
                    // Add platform to each action
                    const actionsWithPlatform = result.actions.map((action: any) => ({
                        ...action,
                        platform: result.platform
                    }));
                    acc.platforms[platform].actions.push(...actionsWithPlatform);
                }
                // For getActionKnowledge, store the action knowledge
                else if (toolName === "getActionKnowledge" && result?.action) {
                    if (!acc.knowledge) {
                        acc.knowledge = [];
                    }
                    acc.knowledge.push({
                        platform: result.platform || '',
                        action: result.action
                    });
                }
            }
            return acc;
        }, {
            platforms: {} as Record<string, { name: string; actions: any[] }>,
            knowledge: [] as Array<{ platform: string; action: any }>,
            executeResults: [] as ExecuteResult[]
        });

        // Calculate total actions across all platforms
        const totalActions = Object.values(allActions?.platforms || {})
            .reduce((sum, platform) => sum + platform.actions.length, 0);

        return (
            <div className="space-y-4 mt-4">
                {/* Show KnowledgeCard if we have any platforms or knowledge */}
                {(Object.keys(allActions.platforms).length > 0 || (allActions.knowledge && allActions.knowledge.length > 0)) && (
                    <KnowledgeCard
                        actions={Object.values(allActions.platforms).flatMap(p => p.actions)}
                        knowledge={allActions.knowledge}
                        platform={Object.values(allActions.platforms)[0]?.name || ''}
                        totalActions={totalActions}
                    />
                )}

                {/* Show ExecuteCard if we have any valid execute results */}
                {allActions.executeResults && allActions.executeResults.length > 0 && (
                    <ExecuteCard results={allActions.executeResults} />
                )}

                {/* If there are any other tool invocations that weren't processed above, show them as JSON */}
                {message.toolInvocations.filter(tool =>
                    !(tool as any).toolName ||
                    !["execute", "getAvailableActions", "getActionKnowledge"].includes((tool as any).toolName)
                ).map((tool, index) => (
                    <div key={index} className="border border-primary/20 rounded-xl p-4 bg-primary/5 my-2">
                        <pre className="bg-gray-800 p-2 rounded-lg text-xs overflow-x-auto">
                            {JSON.stringify(tool, null, 2)}
                        </pre>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <motion.div
            className="py-2 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {isUser ? (
                <div className="flex justify-end">
                    <div className="max-w-[65%]">
                        <div className="rounded-[18px] py-2.5 px-4 bg-gray-100 dark:bg-gray-800">
                            <div className={cn(
                                "prose prose-sm max-w-none text-gray-800",
                                "dark:prose-invert",
                                "prose-p:leading-relaxed prose-pre:p-0",
                                "break-words",
                            )}>
                                <Markdown>{message.content}</Markdown>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-start">
                    <Avatar className="h-8 w-8 shrink-0 mt-0.5 mr-3">
                        <AvatarFallback className="bg-primary text-white">
                            <Bot className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>

                    <div className="max-w-[85%] text-gray-800 dark:text-gray-200">
                        <div className={cn(
                            "prose prose-sm max-w-none",
                            "dark:prose-invert",
                            "prose-p:leading-relaxed prose-pre:p-0",
                            "break-words",
                        )}>
                            <Markdown>{message.content}</Markdown>
                            {processToolInvocations()}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

