"use client"

import React from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/utils/cn"
import { ViewVerticalIcon } from "@radix-ui/react-icons"

export function SidebarToggle() {
    const { state, toggleSidebar } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <div
            className={cn(
                "fixed top-[72px] left-5 z-30 transition-all duration-300",
                isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none -translate-x-10"
            )}
        >
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-md bg-background dark:bg-gray-800 hover:bg-primary/10 border"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
            >
                <ViewVerticalIcon className="h-4 w-4" />
            </Button>
        </div>
    )
}
