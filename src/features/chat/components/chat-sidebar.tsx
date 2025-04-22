"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { LogOut, Moon, MoreHorizontal, Pencil, PlusCircle, Settings, Sun, Trash2, User } from "lucide-react"
import { nanoid } from "nanoid"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarSeparator,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { clearChat, clearChats, getChats, updateChatTitle } from "@/features/chat/actions/chat"
import { AuthKitButton } from "@/features/chat/components/authkit-button"
import { supabase } from "@/libs/supabase/supabase-client"
import type { Chat } from "@/types/chat"
import { cn } from "@/utils/cn"
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ConfirmationDialogProps {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: (e?: React.MouseEvent<HTMLButtonElement> | Event) => void;
}

function ConfirmationDialogContent({
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm
}: ConfirmationDialogProps) {
    return (
        <DialogContent className="sm:max-w-[425px] bg-[#f8f5f2] dark:bg-[#242525] rounded-lg text-black dark:text-white border border-gray-300 dark:border-gray-700">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-lg bg-transparent border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {cancelText}
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-lg bg-transparent border border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}

export function ChatSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [chats, setChats] = useState<Chat[]>([])
    const [loadingChats, setLoadingChats] = useState(true)
    const [editingChatId, setEditingChatId] = useState<string | null>(null)
    const [editingValue, setEditingValue] = useState("")
    const editInputRef = useRef<HTMLInputElement>(null)
    const { theme, setTheme } = useTheme()
    const [userData, setUserData] = useState<SupabaseUser | null>(null);

    const handleSignOut = async () => {
        console.log("Signing out...")
        router.push('/login')
    }

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

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUserData(user);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (editingChatId && editInputRef.current) {
            editInputRef.current.focus()
            editInputRef.current.select()
        }
    }, [editingChatId])

    async function handleClearAllChats() {
        try {
            await clearChats()
            setChats([])
            router.refresh()
            if (pathname.startsWith('/chat/')) {
                router.push('/')
            }
        } catch (error) {
            console.error("Failed to clear chats:", error)
        }
    }

    async function handleDeleteChat(id: string) {
        const currentChats = chats
        setChats(prev => prev.filter(chat => chat.id !== id))
        try {
            await clearChat(id)
            router.refresh()
            if (pathname === `/chat/${id}`) {
                router.push('/')
            }
        } catch (error) {
            console.error(`Failed to delete chat ${id}:`, error)
            setChats(currentChats)
        }
    }

    function handleStartEdit(chat: Chat) {
        setEditingChatId(chat.id)
        setEditingValue(chat.title || "Untitled Chat")
    }

    function handleCancelEdit() {
        setEditingChatId(null)
        setEditingValue("")
    }

    async function handleSaveTitle(chatId: string) {
        if (!editingValue.trim() || !editingChatId || chatId !== editingChatId) {
            handleCancelEdit()
            return
        }
        const originalTitle = chats.find(c => c.id === chatId)?.title
        const newTitle = editingValue.trim()

        if (newTitle === originalTitle) {
            handleCancelEdit()
            return
        }

        setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c))
        setEditingChatId(null)
        setEditingValue("")

        try {
            const updatedChat = await updateChatTitle(chatId, newTitle)
            router.refresh()
            if (!updatedChat) {
                setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: originalTitle || "Untitled Chat" } : c))
                console.error("Failed to update title on server.")
            }
        } catch (error) {
            setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: originalTitle || "Untitled Chat" } : c))
            console.error(`Failed to save title for chat ${chatId}:`, error)
        }
    }

    function handleEditInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>, chatId: string) {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSaveTitle(chatId)
        } else if (event.key === 'Escape') {
            event.preventDefault()
            handleCancelEdit()
        }
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Sidebar className="bg-[#f8f5f2] dark:bg-[#242525] text-black dark:text-white flex flex-col h-full">
                <SidebarHeader>
                    <div className="flex items-center justify-between px-3 pt-3">
                        <SidebarTrigger className="h-9 w-9 bg-[#f8f5f2] dark:bg-[#242525] text-black dark:text-white hover:bg-[#eae2d8] dark:hover:bg-[#343541]" />
                        <div className="flex items-center gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-black dark:text-white hover:bg-[#eae2d8] dark:hover:bg-[#343541]"
                                    >
                                        <Link href={`/chat/${nanoid()}`}>
                                            <PlusCircle className="h-4 w-4" />
                                            <span className="sr-only">New Chat</span>
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="bg-black/70 text-white text-xs rounded px-2 py-1">
                                    New Chat
                                </TooltipContent>
                            </Tooltip>
                            <Dialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10 dark:text-red-500 dark:hover:bg-red-500/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Clear All Chats</span>
                                            </Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-black/70 text-white text-xs rounded px-2 py-1">
                                        Clear All Chats
                                    </TooltipContent>
                                </Tooltip>
                                <ConfirmationDialogContent
                                    title="Clear All Chats?"
                                    description="This action cannot be undone. All your conversations will be permanently deleted."
                                    confirmText="Clear All"
                                    onConfirm={handleClearAllChats}
                                />
                            </Dialog>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent className="flex-1 overflow-y-auto">
                    <SidebarGroup className="pt-2">
                        <SidebarGroupLabel className="text-black dark:text-white text-xs px-4">Recent Chats</SidebarGroupLabel>
                        <SidebarMenu>
                            {loadingChats ? (
                                <div className="px-4 py-2 text-xs text-black/70 dark:text-white/70">Loading...</div>
                            ) : chats.length > 0 ? (
                                chats.map((chat) => (
                                    <li key={chat.id} className="group flex items-center justify-between px-2 py-0.5 hover:bg-[#eae2d8] dark:hover:bg-[#343541] rounded-md">
                                        {editingChatId === chat.id ? (
                                            <div className="flex-grow flex items-center gap-1 py-1 pl-2 pr-1">
                                                <Input
                                                    ref={editInputRef}
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    onKeyDown={(e) => handleEditInputKeyDown(e, chat.id)}
                                                    onBlur={() => handleSaveTitle(chat.id)}
                                                    className="h-7 text-xs flex-grow bg-white dark:bg-black/30 border-gray-300 dark:border-gray-600 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <Link
                                                    href={`/chat/${chat.id}`}
                                                    className={cn(
                                                        "flex-grow text-xs truncate transition-colors rounded-md px-2 py-1.5",
                                                        pathname === `/chat/${chat.id}`
                                                            ? "text-black dark:text-white font-semibold"
                                                            : "text-black/80 dark:text-white/80"
                                                    )}
                                                    title={chat.title || "Untitled Chat"}
                                                >
                                                    {chat.title || "Untitled Chat"}
                                                </Link>
                                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                                                    <Dialog>
                                                        <DropdownMenu>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6 text-black dark:text-white hover:bg-[#eae2d8] dark:hover:bg-[#343541]"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                            <span className="sr-only">More options</span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="bottom" className="bg-black/70 text-white text-xs rounded px-2 py-1">
                                                                    More options
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="bg-[#f8f5f2] dark:bg-[#242525] text-black dark:text-white border border-gray-300 dark:border-gray-700 w-40 rounded-lg"
                                                            >
                                                                <DropdownMenuItem
                                                                    className="text-xs cursor-pointer hover:bg-[#eae2d8] dark:hover:bg-[#343541] focus:bg-[#eae2d8] dark:focus:bg-[#343541] rounded-[5px]"
                                                                    onClick={(e) => { e.preventDefault(); handleStartEdit(chat); }}
                                                                >
                                                                    <Pencil className="mr-2 h-3.5 w-3.5" />
                                                                    <span>Edit title</span>
                                                                </DropdownMenuItem>
                                                                <DialogTrigger asChild>
                                                                    <DropdownMenuItem
                                                                        className="text-xs cursor-pointer text-destructive dark:text-red-500 hover:!bg-destructive/10 hover:!text-destructive dark:hover:!bg-red-500/10 dark:hover:!text-red-500 focus:bg-destructive/10 focus:text-destructive dark:focus:bg-red-500/10 dark:focus:text-red-500 rounded-[5px]"
                                                                        onSelect={(e) => e.preventDefault()}
                                                                    >
                                                                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                                        <span>Delete chat</span>
                                                                    </DropdownMenuItem>
                                                                </DialogTrigger>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <ConfirmationDialogContent
                                                            title="Delete Chat?"
                                                            description={`Are you sure you want to delete "${chat.title || 'this chat'}"?`}
                                                            confirmText="Delete"
                                                            onConfirm={(e?: React.MouseEvent<HTMLButtonElement> | Event) => { e?.preventDefault(); handleDeleteChat(chat.id); }}
                                                        />
                                                    </Dialog>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-xs text-black/70 dark:text-white/70">No chats yet</div>
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                    <SidebarSeparator className="bg-gray-300 dark:bg-gray-700" />
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-black dark:text-white text-xs px-4">Integrations</SidebarGroupLabel>
                        <div className="px-4 py-2">
                            <AuthKitButton />
                        </div>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="mt-auto border-t border-gray-300 dark:border-gray-700 p-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start items-center text-left h-auto px-2 py-1.5 hover:bg-[#eae2d8] dark:hover:bg-[#343541]">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                                        {userData?.user_metadata?.name?.charAt(0).toUpperCase() || userData?.email?.charAt(0).toUpperCase() || <User size={12} />}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-medium truncate">{userData?.user_metadata?.name || userData?.email || "User"}</span>
                                        <span className="text-xs text-black/60 dark:text-white/60 truncate">{userData?.email || "Loading..."}</span>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            side="top"
                            className="bg-[#f8f5f2] dark:bg-[#242525] text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg w-60 mb-1"
                        >
                            <DropdownMenuItem asChild className="text-xs hover:bg-[#eae2d8] dark:hover:bg-[#343541] focus:bg-[#eae2d8] dark:focus:bg-[#343541] cursor-pointer rounded-[5px]">
                                <Link href="/settings" className="flex items-center">
                                    <Settings className="mr-2 h-3.5 w-3.5" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-xs hover:bg-[#eae2d8] dark:hover:bg-[#343541] focus:bg-[#eae2d8] dark:focus:bg-[#343541] cursor-pointer rounded-[5px] flex items-center"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                {theme === "dark" ? <Sun className="mr-2 h-3.5 w-3.5" /> : <Moon className="mr-2 h-3.5 w-3.5" />}
                                <span>Toggle Theme</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-300 dark:bg-gray-700" />
                            <DropdownMenuItem
                                className="text-xs text-destructive dark:text-red-500 hover:!bg-destructive/10 hover:!text-destructive dark:hover:!bg-red-500/10 dark:hover:!text-red-500 focus:bg-destructive/10 focus:text-destructive dark:focus:bg-red-500/10 dark:focus:text-red-500 cursor-pointer rounded-[5px] flex items-center"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-2 h-3.5 w-3.5" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    )
}

