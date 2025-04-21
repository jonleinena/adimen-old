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
                "fixed left-5 top-5 z-30 transition-all duration-300",
                isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none -translate-x-10"
            )}
        >
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-[#f8f5f2] dark:bg-[#343541] text-black dark:text-white hover:bg-[#eae2d8] dark:hover:bg-[#444654]"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
            >
                <ViewVerticalIcon className="h-4 w-4" />
            </Button>
        </div>
    )
}
