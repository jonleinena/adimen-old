'use client'

import { ToolInvocation } from 'ai'

import { CollapsibleMessage } from '@/features/chat/components/collapsible-message'
import { DefaultSkeleton } from '@/features/chat/components/default-skeleton'
import { Section, ToolArgsSection } from '@/features/chat/components/section'
import { VideoSearchResults } from '@/features/chat/components/video-search-results'
import type { SerperSearchResults } from '@/features/chat/types'

interface VideoSearchSectionProps {
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function VideoSearchSection({
  tool,
  isOpen,
  onOpenChange
}: VideoSearchSectionProps) {
  const isLoading = tool.state === 'call'
  const searchResults: SerperSearchResults =
    tool.state === 'result' ? tool.result : undefined
  const query = tool.args.q as string | undefined

  const header = <ToolArgsSection tool="video_search">{query}</ToolArgsSection>

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={true}
      header={header}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {!isLoading && searchResults ? (
        <Section title="Videos">
          <VideoSearchResults results={searchResults} />
        </Section>
      ) : (
        <DefaultSkeleton />
      )}
    </CollapsibleMessage>
  )
}
