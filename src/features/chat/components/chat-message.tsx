"use client"

import Image from 'next/image';
import { Message } from "ai"
import { motion } from "framer-motion"
import { Bot, ExternalLink, Globe,Search } from "lucide-react"
import { FileText } from "lucide-react"

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

        // Process web search results
        const webSearchResults = message.toolInvocations
            .filter((tool: any) => tool.toolName === "web_search" && tool.state === "result" && tool.result?.success)
            .map((tool: any) => tool.result.results)
            .flat();

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
                {/* Show web search results if any */}
                {webSearchResults && webSearchResults.length > 0 && (
                    <div className="border-l-4 border-primary/50 pl-4">
                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span>Referencias web</span>
                        </div>
                        <div className="grid gap-2">
                            {webSearchResults
                                .sort((a: any, b: any) => b.score - a.score)
                                .slice(0, 3)
                                .map((result: any, index: number) => (
                                    <a 
                                        key={index}
                                        href={result.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-start gap-2 hover:bg-primary/5 p-2 rounded-lg transition-colors"
                                    >
                                        <div className="min-w-[24px] h-6 flex items-center justify-center rounded bg-primary/10 text-primary text-xs font-medium">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:underline truncate">
                                                {result.title}
                                                <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {result.content}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                        </div>
                    </div>
                )}

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
                    !["execute", "getAvailableActions", "getActionKnowledge", "web_search"].includes((tool as any).toolName)
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

    const renderAttachments = () => {
        if (!message.experimental_attachments?.length) return null;

        return (
            <div className="flex flex-row flex-wrap gap-2 mt-2">
                {message.experimental_attachments.map((attachment, index) => {
                    if (attachment.contentType?.includes('image/')) {
                        return (
                            <div key={`${message.id}-${index}`} className="relative">
                                <Image
                                    className="max-w-[200px] rounded-md"
                                    src={attachment.url}
                                    alt={attachment.name ?? 'Attachment image'}
                                    width={200}
                                    height={200}
                                />
                                <span className="text-xs text-muted-foreground mt-1 block truncate">
                                    {attachment.name}
                                </span>
                            </div>
                        );
                    } else if (attachment.contentType?.includes('text/')) {
                        return (
                            <div
                                key={`${message.id}-${index}`}
                                className="max-w-[200px] p-3 rounded-md bg-secondary/50"
                            >
                                <pre className="text-xs overflow-auto whitespace-pre-wrap break-words">
                                    {attachment.url}
                                </pre>
                                <span className="text-xs text-muted-foreground mt-1 block truncate">
                                    {attachment.name}
                                </span>
                            </div>
                        );
                    } else if (attachment.contentType === 'application/pdf') {
                        return (
                            <div key={`${message.id}-${index}`} className="relative">
                                <div className="max-w-[100px] aspect-[3/4] bg-secondary/50 rounded-md flex flex-col items-center justify-center gap-1">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground block truncate max-w-[90px] px-2">
                                        {attachment.name}
                                    </span>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
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
                        <div className="rounded-[18px] py-2.5 px-4 bg-[#eae2d8] dark:bg-[#343541]">
                            <div className={cn(
                                "prose prose-sm max-w-none text-black dark:text-[#ECECF1] text-[18px]",
                                "dark:prose-invert",
                                "prose-p:leading-relaxed prose-pre:p-0",
                                "break-words",
                            )}>
                                <Markdown>{message.content}</Markdown>
                                {renderAttachments()}
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

                    <div className="max-w-[85%] text-black dark:text-[#ECECF1]">
                        <div className={cn(
                            "prose prose-sm max-w-none text-black dark:text-[#ECECF1] text-[18px]",
                            "dark:prose-invert",
                            "prose-p:leading-relaxed prose-pre:p-0",
                            "break-words",
                        )}>
                            <Markdown>{message.content}</Markdown>
                            {renderAttachments()}
                            {processToolInvocations()}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

