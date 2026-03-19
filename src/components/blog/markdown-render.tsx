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
      className={cn('prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none break-words tracking-tight', className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeKatex]}
        components={{
          // 自定义标题样式
              h1: ({ children, ...props }) => (
                <header className="mb-8 border-b border-border/40 pb-4">
                  <h1 className="text-3xl font-black tracking-tighter text-foreground md:text-4xl" {...props}>
                    {children}
                  </h1>
                </header>
              ),
          h2: ({ id, children }) => (
            <h2
              id={id}
              className="mt-10 mb-5 scroll-m-24 text-xl md:text-2xl font-black tracking-tight text-foreground first:mt-0 relative group"
            >
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
              {children}
            </h2>
          ),
          h3: ({ id, children }) => (
            <h3
              id={id}
              className="mt-8 mb-4 scroll-m-24 text-lg md:text-xl font-black tracking-tight text-foreground"
            >
              {children}
            </h3>
          ),
          h4: ({ id, children }) => (
            <h4
              id={id}
              className="mt-6 mb-3 scroll-m-24 text-base md:text-lg font-black tracking-tight text-foreground"
            >
              {children}
            </h4>
          ),


          // 段落
          p: ({ children }) => (
            <p className="!text-foreground/80 text-[14px] md:text-[15px] leading-relaxed [&:not(:first-child)]:mt-5">
              {children}
            </p>
          ),

          // 链接
          a: ({ href, children }) => {
            const isRef = href && href.startsWith('#')
            return (
              <a
                href={href}
                target={isRef ? undefined : "_blank"}
                rel={isRef ? undefined : "noopener noreferrer"}
                className="font-bold text-primary/80 hover:text-primary transition-colors no-underline border-b border-primary/20 hover:border-primary/50"
              >
                {children}
              </a>
            )
          },

          // 图片
          img: ({ src, alt }) => (
            <span className="my-10 block first:mt-0 last:mb-0">
              <img
                src={src || ''}
                alt={alt || ''}
                className="bg-muted max-h-[700px] rounded-2xl object-contain w-full border border-border/10 shadow-sm"
                loading="lazy"
              />
              {alt && (
                <span className="text-muted-foreground mt-3 block text-center text-xs font-bold opacity-60">
                  {alt}
                </span>
              )}
            </span>
          ),

          // 代码块
          pre: ({ children }) => <>{children}</>,
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'
            const [copied, setCopied] = React.useState(false)

            const onCopy = () => {
              navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }

            if (!inline && match) {
              const { ref, ...rest } = props
              return (
                <div className="group relative my-10 overflow-hidden rounded-2xl border border-border/10 bg-muted/20 first:mt-0 last:mb-0 transition-all duration-300 hover:bg-muted/40 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="flex h-11 items-center justify-between border-b border-border/5 bg-muted/30 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary/20" />
                      <div className="h-2 w-2 rounded-full bg-primary/10" />
                      <div className="h-2 w-2 rounded-full bg-primary/5" />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground/40 font-mono tracking-[0.3em] uppercase ml-2">{language}</span>
                  </div>
                  <div className="relative p-6 px-8 overflow-x-auto scrollbar-hide [&_code]:!bg-transparent [&_pre]:!bg-transparent [&_code::before]:!content-none [&_code::after]:!content-none font-mono text-[13px] leading-relaxed">
                    <SyntaxHighlighter
                      {...rest}
                      style={oneDark as any}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        background: 'transparent',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )
            }
            return (
              <code
                className="rounded-md bg-muted px-[0.3rem] py-[0.1rem] font-mono text-[12px] font-bold text-foreground/70 border border-border/5 [&::before]:!content-none [&::after]:!content-none"
                {...props}
              >
                {children}
              </code>
            )
          },

          // 引用块
          blockquote: ({ children }) => (
            <blockquote className="my-10 overflow-hidden rounded-r-2xl border-l-[5px] border-primary/40 bg-primary/[0.03] py-8 pl-10 pr-8 text-foreground/80 shadow-sm ring-1 ring-inset ring-primary/5 transition-all hover:bg-primary/[0.06] hover:shadow-md">
              <div className="relative text-[15px] md:text-[16px] font-medium leading-loose italic">
                {children}
              </div>
            </blockquote>
          ),


          // 列表
          ul: ({ children }) => (
            <ul className="my-5 ml-5 list-disc space-y-2 marker:text-muted-foreground/50">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-5 ml-5 list-decimal space-y-2 marker:text-muted-foreground/50">
              {children}
            </ol>
          ),
          li: ({ children }) => {
            return (
              <li className="!text-foreground/80 text-[14px] md:text-[15px] leading-relaxed pl-1">
                {children}
              </li>
            )
          },

          strong: ({ children }) => (
            <strong className="font-bold !text-foreground">{children}</strong>
          ),

          // 表格
          table: ({ children }) => (
            <div className="group relative my-12 w-full overflow-hidden rounded-2xl border border-border/20 bg-card/30 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[600px] border-collapse text-[13px] leading-relaxed">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/30 border-b border-border/50">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-border/20 bg-card/[0.02]">{children}</tbody>,
          tr: ({ children }) => <tr className="transition-colors hover:bg-muted/20">{children}</tr>,
          th: ({ children }) => (
            <th className="px-5 py-3 text-left font-black !text-foreground/60 uppercase tracking-[0.2em] text-[10px]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-5 py-4 align-middle !text-foreground/70 font-medium border-l border-border/10 first:border-l-0">
              {children}
            </td>
          ),

          // 分隔线
          hr: () => <hr className="border-border/30 my-10 border-t" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article >
  )
}
