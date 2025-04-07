"use client"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownProps {
    children: string
}

export function Markdown({ children }: MarkdownProps) {
    return (
        <ReactMarkdown
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    return !inline && match ? (
                        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" className="rounded-md" {...props}>
                            {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                },
                pre({ children }) {
                    return <pre className="rounded-md bg-gray-100 p-0 dark:bg-gray-900">{children}</pre>
                },
                p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>
                },
            }
            }
        >
            {children}
        </ReactMarkdown>
    )
}

