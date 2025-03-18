'use client'

import { useChat } from 'ai/react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { ChatShare } from '@/features/chat/components/chat-share'
import { CHAT_ID } from '@/features/chat/constants'
import { cn } from '@/utils/cn'

interface MessageActionsProps {
  message: string
  chatId?: string
  enableShare?: boolean
  className?: string
}

export function MessageActions({
  message,
  chatId,
  enableShare,
  className
}: MessageActionsProps) {
  const { isLoading } = useChat({
    id: CHAT_ID
  })
  async function handleCopy() {
    await navigator.clipboard.writeText(message)
    toast.success('Message copied to clipboard')
  }

  if (isLoading) {
    return <div className="size-10" />
  }

  return (
    <div className={cn('flex items-center gap-0.5 self-end', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="rounded-full"
      >
        <Copy size={14} />
      </Button>
      {enableShare && chatId && <ChatShare chatId={chatId} />}
    </div>
  )
}
