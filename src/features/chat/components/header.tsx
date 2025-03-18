import React from 'react'
import Link from 'next/link'

import { IconLogo } from '@/components/ui/icons'
import { cn } from '@/utils/cn'

import HistoryContainer from './history-container'
import { ModeToggle } from './mode-toggle'

export const Header: React.FC = async () => {
  return (
    <header className="fixed w-full p-2 flex justify-between items-center z-10 backdrop-blur lg:backdrop-blur-none bg-background/80 lg:bg-transparent">
      <div>
        <Link href="/">
          <IconLogo className={cn('w-5 h-5')} />
          <span className="sr-only">Morphic</span>
        </Link>
      </div>
      <div className="flex gap-0.5">
        <ModeToggle />
        <HistoryContainer />
      </div>
    </header>
  )
}

export default Header
