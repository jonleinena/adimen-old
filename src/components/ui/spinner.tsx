// Based on: https://github.com/vercel/ai/blob/main/examples/next-ai-rsc/components/llm-stocks/spinner.tsx

'use client'

import { Loader2 } from 'lucide-react'

import { cn } from '@/utils/cn'

interface SpinnerProps {
  className?: string
}

export const Spinner = ({ className }: SpinnerProps) => (
  <Loader2
    className={cn('h-5 w-5 animate-spin', className)}
    aria-label="Loading"
  />
)
