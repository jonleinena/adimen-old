"use client"

import Image from 'next/image';
import { ChevronRight,ExternalLink, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface WebSearchResult {
    url: string;
    title: string;
    score: number;
    // Add other relevant fields if necessary
}

interface ChatMessageSourcesProps {
    webSearchResults: WebSearchResult[];
}

export function ChatMessageSources({ webSearchResults }: ChatMessageSourcesProps) {
    if (!webSearchResults || webSearchResults.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-primary flex items-center gap-1 h-7 mt-2 ml-auto hover:bg-primary/5"
                >
                    <Globe className="h-3 w-3" />
                    Sources
                    <ChevronRight className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="start" 
                side="right"
                sideOffset={10} 
                className="w-[280px] max-h-[300px] overflow-auto p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg"
            >
                <div className="grid gap-2">
                    {webSearchResults
                        .sort((a: any, b: any) => b.score - a.score)
                        .map((result: any, index: number) => {
                            // Extract domain from URL
                            let domain = '';
                            try {
                                domain = new URL(result.url).hostname.replace('www.', '');
                            } catch (e) {
                                // Fallback for potentially invalid URLs
                                const parts = result.url.split('/');
                                domain = parts[2] || result.url;
                            }
                            
                            // Construir URL del favicon
                            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;

                            return (
                                <a
                                    key={index}
                                    href={result.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                                >
                                    <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                                        <Image
                                            src={faviconUrl}
                                            alt={`Favicon for ${domain}`}
                                            width={16}
                                            height={16}
                                            className="rounded-sm"
                                            unoptimized // Necesario para URLs externas dinámicas
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <span className="text-[10px] text-muted-foreground truncate">{domain}</span>
                                        <span className="text-xs font-medium text-primary group-hover:underline truncate">
                                            {result.title}
                                        </span>
                                    </div>
                                    <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                </a>
                            );
                        })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 