'use client';

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#444654] px-2 h-7 gap-1"
        >
          {theme === 'light' ? (
            <>
              <Sun className="mr-1 h-3.5 w-3.5" />
              <span className="text-xs">Light</span>
            </>
          ) : (
            <>
              <Moon className="mr-1 h-3.5 w-3.5" />
              <span className="text-xs">Dark</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-[#343541] text-gray-900 dark:text-white border-gray-200 dark:border-none min-w-[auto]">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="hover:bg-gray-100 dark:hover:bg-[#444654] focus:bg-gray-100 dark:focus:bg-[#444654] cursor-pointer text-xs px-2 py-1 h-7 gap-1"
        >
          <Sun className="mr-1 h-3.5 w-3.5" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="hover:bg-gray-100 dark:hover:bg-[#444654] focus:bg-gray-100 dark:focus:bg-[#444654] cursor-pointer text-xs px-2 py-1 h-7 gap-1"
        >
          <Moon className="mr-1 h-3.5 w-3.5" />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 