"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MoreHorizontal, Pencil, PlusCircle, Settings, Trash2 } from "lucide-react"
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
import type { Chat } from "@/types/chat"
import { cn } from "@/utils/cn"

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
        <DialogContent className="sm:max-w-[425px] bg-[#f8f5f2] dark:bg-[#242525] rounded-lg text-black dark:text-white">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="rounded-lg">{cancelText}</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
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
            <Sidebar className="bg-[#eae2d8] dark:bg-[#343541] text-black dark:text-white">
                <SidebarHeader>
                    <div className="flex items-center justify-between px-3 pt-3">
                        <SidebarTrigger className="h-9 w-9 bg-[#eae2d8] dark:bg-[#343541] text-black dark:text-white hover:bg-[#f8f5f2] dark:hover:bg-[#444654]" />
                        <div className="flex items-center gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-black dark:text-white hover:bg-[#f8f5f2] dark:hover:bg-[#444654]"
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
                <SidebarContent>
                    <SidebarGroup className="pt-2">
                        <SidebarGroupLabel className="text-black dark:text-white text-xs px-4">Recent Chats</SidebarGroupLabel>
                        <SidebarMenu>
                            {loadingChats ? (
                                <div className="px-4 py-2 text-xs text-black/70 dark:text-white/70">Loading...</div>
                            ) : chats.length > 0 ? (
                                chats.map((chat) => (
                                    <li key={chat.id} className="group flex items-center justify-between px-2 py-0.5 hover:bg-[#f8f5f2] dark:hover:bg-[#444654] rounded-md">
                                        {editingChatId === chat.id ? (
                                            <div className="flex-grow flex items-center gap-1 py-1 pl-2 pr-1">
                                                <Input
                                                    ref={editInputRef}
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    onKeyDown={(e) => handleEditInputKeyDown(e, chat.id)}
                                                    onBlur={() => handleSaveTitle(chat.id)}
                                                    className="h-7 text-xs flex-grow bg-white dark:bg-black/30 border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
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
                                                            : "text-black dark:text-white"
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
                                                                            className="h-6 w-6 text-black dark:text-white hover:bg-[#e0d9d1] dark:hover:bg-[#4E4F60]"
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
                                                                className="bg-[#f8f5f2] dark:bg-[#242525] text-black dark:text-white border-gray-300 dark:border-gray-700 w-40 rounded-md"
                                                            >
                                                                <DropdownMenuItem
                                                                    className="text-xs cursor-pointer hover:bg-[#e0d9d1] dark:hover:bg-[#4E4F60] focus:bg-[#e0d9d1] dark:focus:bg-[#4E4F60]"
                                                                    onClick={(e) => { e.preventDefault(); handleStartEdit(chat); }}
                                                                >
                                                                    <Pencil className="mr-2 h-3.5 w-3.5" />
                                                                    <span>Edit title</span>
                                                                </DropdownMenuItem>
                                                                <DialogTrigger asChild>
                                                                    <DropdownMenuItem
                                                                        className="text-xs cursor-pointer text-destructive dark:text-red-500 hover:!bg-destructive/10 hover:!text-destructive dark:hover:!bg-red-500/10 dark:hover:!text-red-500 focus:bg-destructive/10 focus:text-destructive dark:focus:bg-red-500/10 dark:focus:text-red-500"
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
                    <SidebarSeparator className="bg-gray-200 dark:bg-[#4E4F60]" />
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-black dark:text-white text-xs px-4">Integrations</SidebarGroupLabel>
                        <div className="px-4 py-2">
                            <AuthKitButton />
                        </div>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarSeparator className="bg-gray-200 dark:bg-[#4E4F60]" />
                    <div className="flex items-center justify-between p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-black dark:text-white hover:bg-[#f8f5f2] dark:hover:bg-[#444654]">
                                    <Settings className="h-5 w-5" />
                                    <span className="sr-only">Settings</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#eae2d8] dark:bg-[#343541] text-black dark:text-white border-gray-200 dark:border-none">
                                <DropdownMenuItem asChild className="text-xs hover:bg-[#f8f5f2] dark:hover:bg-[#444654] focus:bg-[#f8f5f2] dark:focus:bg-[#444654] cursor-pointer">
                                    <Link href="/settings" className="flex items-center">
                                        <Settings className="mr-2 h-3 w-3" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    )
}

