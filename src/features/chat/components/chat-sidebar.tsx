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
import { clearChats, getChats } from "@/features/chat/actions/chat"
import { AuthKitButton } from "@/features/chat/components/authkit-button"
import type { Chat } from "@/types/chat"
import { getEnvVar } from '@/utils/get-env-var'
import { createBrowserClient } from '@supabase/ssr'

export function ChatSidebar() {
    const pathname = usePathname()
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<{ id: string } | null>(null)

    const supabase = createBrowserClient(
        getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
        getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
    )

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase.auth])

    useEffect(() => {
        async function loadChats() {
            setLoading(true)
            try {
                const userId = user?.id || "anonymous"
                const chatList = await getChats(userId)
                setChats(chatList)
            } catch (error) {
                console.error("Failed to load chats:", error)
            } finally {
                setLoading(false)
            }
        }

        loadChats()
    }, [user?.id])

    async function handleClearChats() {
        try {
            const userId = user?.id || "anonymous"
            await clearChats(userId)
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
                        {loading ? (
                            <div className="px-4 py-2 text-sm text-muted-foreground">Loading chats...</div>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <User className="h-5 w-5" />
                                <span className="sr-only">User menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleClearChats}>Clear all chats</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

