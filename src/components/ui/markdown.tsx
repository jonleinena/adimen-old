import { FC, memo } from 'react'
import ReactMarkdown, { Options } from 'react-markdown'

// Define a custom options type that includes all needed props
export type MarkdownOptions = Options & {
  className?: string
}

export const MemoizedReactMarkdown: FC<MarkdownOptions> = memo(
  ReactMarkdown as FC<MarkdownOptions>,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
)
