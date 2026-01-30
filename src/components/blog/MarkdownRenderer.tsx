'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MarkdownRendererProps {
    content: string
    className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <article className={cn('prose prose-neutral dark:prose-invert max-w-none', className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                ]}
                components={{
                    // 自定义标题样式
                    h1: ({ id, children }) => (
                        <h1 id={id} className="mb-8 mt-16 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl first:mt-0 text-foreground">
                            {children}
                        </h1>
                    ),
                    h2: ({ id, children }) => (
                        <h2 id={id} className="mb-6 mt-12 scroll-m-20 text-3xl font-semibold tracking-tight text-foreground first:mt-0">
                            {children}
                        </h2>
                    ),
                    h3: ({ id, children }) => (
                        <h3 id={id} className="mb-4 mt-10 scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">{children}</h3>
                    ),
                    h4: ({ id, children }) => (
                        <h4 id={id} className="mb-4 mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-foreground">{children}</h4>
                    ),

                    // 段落
                    p: ({ children }) => (
                        <p className="leading-relaxed [&:not(:first-child)]:mt-8 text-foreground/90 text-lg decoration-primary/20 underline-offset-4">{children}</p>
                    ),

                    // 链接
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-medium underline decoration-primary/30 underline-offset-4 transition-all hover:decoration-primary hover:text-primary/80"
                        >
                            {children}
                        </a>
                    ),

                    // 图片
                    img: ({ src, alt }) => (
                        <figure className="my-10">
                            <img
                                src={src}
                                alt={alt || ''}
                                className="block w-full rounded-2xl border border-border/50 bg-muted/20 shadow-sm transition-all hover:shadow-md"
                                loading="lazy"
                            />
                            {alt && (
                                <figcaption className="mt-4 text-center text-sm font-medium text-muted-foreground/80">
                                    {alt}
                                </figcaption>
                            )}
                        </figure>
                    ),

                    // 代码块
                    pre: ({ children }) => <>{children}</>,
                    code: ({ node, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !className
                        const [copied, setCopied] = React.useState(false)

                        const onCopy = () => {
                            navigator.clipboard.writeText(String(children))
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                        }

                        if (isInline) {
                            return (
                                <code
                                    className="rounded-md bg-muted/50 px-1.5 py-0.5 font-mono text-sm font-medium text-foreground border border-border/50"
                                    {...props}
                                >
                                    {children}
                                </code>
                            )
                        }

                        const { ref, ...rest } = props

                        return (
                            <div className="relative group/code my-10 overflow-hidden rounded-2xl bg-[#1e1e1e] shadow-xl ring-1 ring-border/10">
                                {/* 顶部栏 */}
                                <div className="flex items-center justify-between bg-white/[0.05] px-4 py-3 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 rounded-md text-white/40 hover:bg-white/10 hover:text-white transition-all"
                                        onClick={onCopy}
                                    >
                                        {copied ? (
                                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                        )}
                                    </Button>
                                </div>
                                <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 p-1">
                                    <SyntaxHighlighter
                                        language={match ? match[1] : ''}
                                        style={oneDark as any}
                                        PreTag="div"
                                        customStyle={{
                                            margin: 0,
                                            padding: '1.5rem',
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            background: 'transparent',
                                            minWidth: '100%',
                                        }}
                                        codeTagProps={{
                                            style: {
                                                fontFamily: 'var(--font-mono, monospace)',
                                                background: 'transparent',
                                                color: 'inherit',
                                            },
                                        }}
                                        {...rest}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        )
                    },

                    // 引用块
                    blockquote: ({ children }) => (
                        <blockquote className="my-8 border-l-2 border-primary/40 pl-6 text-lg italic text-muted-foreground/90 leading-relaxed">
                            {children}
                        </blockquote>
                    ),

                    // 列表
                    ul: ({ children }) => (
                        <ul className="my-8 ml-6 list-disc [&>li]:mt-3 text-foreground/90">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-8 ml-6 list-decimal [&>li]:mt-3 text-foreground/90">{children}</ol>
                    ),
                    li: ({ children }) => <li className="pl-2">{children}</li>,

                    // 表格
                    table: ({ children }) => (
                        <div className="my-10 w-full overflow-hidden rounded-xl border border-border/50 shadow-sm">
                            <table className="w-full text-sm text-left">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className="bg-muted/30 text-xs uppercase font-semibold text-muted-foreground">{children}</thead>,
                    tbody: ({ children }) => <tbody className="divide-y divide-border/30 bg-background/50">{children}</tbody>,
                    tr: ({ children }) => <tr className="transition-colors hover:bg-muted/20">{children}</tr>,
                    th: ({ children }) => (
                        <th className="px-6 py-4 font-medium tracking-wider">{children}</th>
                    ),
                    td: ({ children }) => <td className="px-6 py-4 text-foreground/80">{children}</td>,

                    // 分隔线
                    hr: () => <hr className="my-12 border-t border-border/40" />,
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    )
}
