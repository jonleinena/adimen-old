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
          className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#444654]"
        >
          {theme === 'light' ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-[#343541] text-gray-900 dark:text-white border-gray-200 dark:border-none">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="hover:bg-gray-100 dark:hover:bg-[#444654] focus:bg-gray-100 dark:focus:bg-[#444654] cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="hover:bg-gray-100 dark:hover:bg-[#444654] focus:bg-gray-100 dark:focus:bg-[#444654] cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 