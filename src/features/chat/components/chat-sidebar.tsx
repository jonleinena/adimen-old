"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircle, Settings } from "lucide-react"
import { nanoid } from "nanoid"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { clearChats, getChats } from "@/features/chat/actions/chat"
import { AuthKitButton } from "@/features/chat/components/authkit-button"
import type { Chat } from "@/types/chat"
import { cn } from "@/utils/cn"

export function ChatSidebar() {
    const pathname = usePathname()
    const [chats, setChats] = useState<Chat[]>([])
    const [loadingChats, setLoadingChats] = useState(true)

    useEffect(() => {
        async function loadChats() {
            setLoadingChats(true)
            try {
                const chatList = await getChats()
                setChats(chatList)
            } catch (error) {
                console.error("Failed to load chats:", error)
                setChats([])
            } finally {
                setLoadingChats(false)
            }
        }

        loadChats()
    }, [])

    async function handleClearChats() {
        try {
            await clearChats()
            setChats([])
        } catch (error) {
            console.error("Failed to clear chats:", error)
        }
    }

    return (
        <Sidebar className="bg-[#343541] text-white">
            <SidebarHeader>
                <div className="flex items-center justify-between px-4 py-2">
                    <h2 className="text-lg font-semibold text-white">Chats</h2>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className="px-4 py-2">
                        <Button asChild variant="outline" className="w-full justify-start bg-transparent text-white border-[#4E4F60] hover:bg-[#444654] hover:text-white">
                            <Link href={`/chat/${nanoid()}`}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Chat
                            </Link>
                        </Button>
                    </div>
                    <SidebarGroupLabel className="text-white">Recent Chats</SidebarGroupLabel>
                    <SidebarMenu>
                        {loadingChats ? (
                            <div className="px-4 py-2 text-sm text-white/70">Loading...</div>
                        ) : chats.length > 0 ? (
                            chats.map((chat) => (
                                <li key={chat.id} className="px-4 py-1">
                                    <Link
                                        href={`/chat/${chat.id}`}
                                        className={cn(
                                            "block text-sm truncate transition-colors rounded-md px-2 py-1",
                                            pathname === `/chat/${chat.id}`
                                                ? "bg-[#444654] text-white font-medium"
                                                : "text-white hover:bg-[#444654]"
                                        )}
                                        title={chat.title || "Untitled Chat"}
                                    >
                                        {chat.title || "Untitled Chat"}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-white/70">No chats yet</div>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarSeparator className="bg-[#4E4F60]" />
                <SidebarGroup>
                    <SidebarGroupLabel className="text-white">Integrations</SidebarGroupLabel>
                    <div className="px-4 py-2">
                        <AuthKitButton />
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarSeparator className="bg-[#4E4F60]" />
                <div className="flex items-center justify-between p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-[#444654]">
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#343541] text-white border-none">
                            <DropdownMenuItem asChild className="hover:bg-[#444654] focus:bg-[#444654] cursor-pointer">
                                <Link href="/settings" className="flex items-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#4E4F60]" />
                            <DropdownMenuItem onClick={handleClearChats} className="hover:bg-[#444654] focus:bg-[#444654] cursor-pointer">
                                Clear all chats
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

