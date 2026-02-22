'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRender({ content, className }: MarkdownRendererProps) {
  return (
    <article
      className={cn('prose prose-neutral dark:prose-invert max-w-none break-words', className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }], rehypeKatex]}
        components={{
          // 自定义标题样式
          h1: ({ id, children }) => (
            <h1
              id={id}
              className="text-foreground mt-16 mb-8 scroll-m-20 text-4xl font-bold tracking-tight first:mt-0 lg:text-5xl"
            >
              {children}
            </h1>
          ),
          h2: ({ id, children }) => (
            <h2
              id={id}
              className="text-foreground mt-12 mb-6 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0"
            >
              {children}
            </h2>
          ),
          h3: ({ id, children }) => (
            <h3
              id={id}
              className="text-foreground mt-10 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              {children}
            </h3>
          ),
          h4: ({ id, children }) => (
            <h4
              id={id}
              className="text-foreground mt-8 mb-4 scroll-m-20 text-xl font-semibold tracking-tight"
            >
              {children}
            </h4>
          ),

          // 段落
          p: ({ children }) => (
            <p className="text-foreground/90 text-lg leading-relaxed dark:text-zinc-200 [&:not(:first-child)]:mt-8">
              {children}
            </p>
          ),

          // 链接
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary decoration-primary/30 hover:decoration-primary hover:text-primary/80 font-medium break-all underline underline-offset-4 transition-all"
            >
              {children}
            </a>
          ),

          // 图片
          img: ({ src, alt }) => (
            <span className="my-10 block w-full">
              <img
                src={src}
                alt={alt || ''}
                className="border-border/50 bg-muted/20 dark:bg-muted/10 block w-full rounded-2xl border shadow-sm transition-all hover:shadow-md"
                loading="lazy"
              />
              {alt && (
                <span className="text-muted-foreground/80 mt-4 block text-center text-sm font-medium">
                  {alt}
                </span>
              )}
            </span>
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
                  className="bg-muted/50 text-foreground border-border/50 rounded-md border px-1.5 py-0.5 font-mono text-sm font-medium dark:text-zinc-200"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            const { ref, ...rest } = props

            return (
              <div className="group/code ring-border/10 relative my-10 overflow-hidden rounded-2xl bg-[#1e1e1e] shadow-xl ring-1">
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
                    className="h-6 w-6 rounded-md text-white/40 transition-all hover:bg-white/10 hover:text-white"
                    onClick={onCopy}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 overflow-x-auto p-1">
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
            <blockquote className="border-primary/40 text-muted-foreground/90 my-8 border-l-2 pl-6 text-lg leading-relaxed italic dark:text-zinc-400">
              {children}
            </blockquote>
          ),

          // 列表
          ul: ({ children }) => (
            <ul className="text-foreground/90 my-8 ml-6 list-disc dark:text-zinc-200 [&>li]:mt-3">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="text-foreground/90 my-8 ml-6 list-decimal dark:text-zinc-200 [&>li]:mt-3">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/90 pl-2 dark:text-zinc-200">{children}</li>
          ),

          // 强调
          strong: ({ children }) => (
            <strong className="text-foreground font-bold dark:text-white">{children}</strong>
          ),

          // 表格
          table: ({ children }) => (
            <div className="not-prose border-border my-8 w-full overflow-hidden rounded-lg border shadow-sm dark:border-white/10">
              <table className="w-full text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50 text-foreground font-semibold uppercase dark:bg-white/5 dark:text-white">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-border divide-y dark:divide-white/10">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/50 transition-colors dark:hover:bg-white/5">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="text-foreground px-6 py-4 text-left font-medium tracking-wider dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="text-foreground/90 px-6 py-4 align-top dark:text-zinc-200">
              {children}
            </td>
          ),

          // 分隔线
          hr: () => <hr className="border-border/40 my-12 border-t dark:border-white/20" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
