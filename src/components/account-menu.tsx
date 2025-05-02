'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoPersonCircleOutline } from 'react-icons/io5';

import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActionResponse } from '@/types/action-response';

import { useToast } from './ui/use-toast';

export function AccountMenu({ signOut }: { signOut: () => Promise<ActionResponse> }) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogoutClick() {
    const response = await signOut();

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred while logging out. Please try again or contact support.',
      });
    } else {
      router.refresh();

      toast({
        description: 'You have been logged out.',
      });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger className='rounded-full flex items-center justify-center h-7 w-7'>
          <IoPersonCircleOutline size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='me-4 bg-white dark:bg-[#343541] text-gray-900 dark:text-white border-gray-200 dark:border-none min-w-[auto]'>
          <DropdownMenuItem onClick={handleLogoutClick} className="text-xs hover:bg-gray-100 dark:hover:bg-[#444654] focus:bg-gray-100 dark:focus:bg-[#444654] cursor-pointer px-2 py-1 h-7">
            Log Out
          </DropdownMenuItem>
          <DropdownMenuArrow className='me-4 fill-white dark:fill-[#343541]' />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
