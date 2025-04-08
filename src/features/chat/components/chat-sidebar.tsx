"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircle, Settings, User } from "lucide-react"
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
import { useUser } from "@/features/account/hooks/use-user"
import { clearChats, getChats } from "@/features/chat/actions/chat"
import { AuthKitButton } from "@/features/chat/components/authkit-button"
import type { Chat } from "@/types/chat"

export function ChatSidebar() {
    const pathname = usePathname()
    const [chats, setChats] = useState<Chat[]>([])
    const [loadingChats, setLoadingChats] = useState(true)
    const { user, loading: loadingUser } = useUser()

    useEffect(() => {
        async function loadChats() {
            if (!user && !loadingUser) {
                setChats([])
                setLoadingChats(false)
                return
            }
            if (loadingUser || !user) return

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
    }, [user, loadingUser])

    async function handleClearChats() {
        if (!user) return
        try {
            await clearChats()
            setChats([])
        } catch (error) {
            console.error("Failed to clear chats:", error)
        }
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-between px-4 py-2">
                    <h2 className="text-lg font-semibold">Chats</h2>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className="px-4 py-2">
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href={`/chat/${nanoid()}`}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Chat
                            </Link>
                        </Button>
                    </div>
                    <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
                    <SidebarMenu>
                        {loadingUser || loadingChats ? (
                            <div className="px-4 py-2 text-sm text-muted-foreground">Loading...</div>
                        ) : !user ? (
                            <div className="px-4 py-2 text-sm text-muted-foreground">Log in to see chats</div>
                        ) : chats.length > 0 ? (
                            chats.map((chat) => (
                                <SidebarMenuItem key={chat.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === `/chat/${chat.id}`}
                                        tooltip={chat.title || "Untitled Chat"}
                                    >
                                        <Link href={`/chat/${chat.id}`}>
                                            <span>{chat.title || "Untitled Chat"}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-muted-foreground">No chats yet</div>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupLabel>Integrations</SidebarGroupLabel>
                    <div className="px-4 py-2">
                        <AuthKitButton />
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarSeparator />
                <div className="flex items-center justify-between p-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">User menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleClearChats}>Clear all chats</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="text-sm text-muted-foreground">Please log in</div>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

