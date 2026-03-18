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
      className={cn('prose prose-lg md:prose-xl prose-neutral dark:prose-invert max-w-none break-words tracking-tight', className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeKatex]}
        components={{
          // 自定义标题样式
          h1: ({ id, children }) => (
            <h1
              id={id}
              className="mt-20 mb-10 scroll-m-24 text-3xl leading-tight font-black tracking-tight text-foreground md:text-5xl first:mt-0"
            >
              <span className="text-primary mr-3 opacity-20 group-hover:opacity-100 transition-opacity">#</span>
              {children}
            </h1>
          ),
          h2: ({ id, children }) => (
            <h2
              id={id}
              className="mt-16 mb-8 scroll-m-24 text-2xl md:text-3xl font-black tracking-tight text-foreground first:mt-0 relative group"
            >
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
              {children}
            </h2>
          ),
          h3: ({ id, children }) => (
            <h3
              id={id}
              className="mt-12 mb-6 scroll-m-24 text-xl md:text-2xl font-black tracking-tight text-foreground"
            >
              {children}
            </h3>
          ),
          h4: ({ id, children }) => (
            <h4
              id={id}
              className="mt-10 mb-4 scroll-m-24 text-lg md:text-xl font-black tracking-tight text-foreground"
            >
              {children}
            </h4>
          ),


          // 段落
          p: ({ children }) => (
            <p className="!text-foreground/90 text-[15px] sm:text-base leading-relaxed [&:not(:first-child)]:mt-6">
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
                className="font-medium text-primary/70 hover:text-primary transition-colors no-underline"
              >
                {children}
              </a>
            )
          },

          // 图片
          img: ({ src, alt }) => (
            <span className="my-12 block first:mt-0 last:mb-0">
              <img
                src={src || ''}
                alt={alt || ''}
                className="bg-muted max-h-[700px] rounded-3xl object-contain w-full border border-border/10"
                loading="lazy"
              />
              {alt && (
                <span className="text-muted-foreground mt-4 block text-center text-sm font-medium opacity-60">
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
                <div className="group relative my-10 overflow-hidden rounded-3xl border border-border/10 bg-muted/30 first:mt-0 last:mb-0 transition-all duration-300 hover:bg-muted/50">
                  <div className="flex h-12 items-center justify-between border-b border-border/10 bg-muted/20 px-5">
                    <span className="text-[12px] font-bold text-muted-foreground/60 font-mono tracking-widest uppercase">{language}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-muted-foreground/40 hover:bg-muted/60 hover:text-foreground transition-all"
                      onClick={onCopy}
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="relative overflow-x-auto scrollbar-hide [&_code]:!bg-transparent [&_pre]:!bg-transparent [&_code::before]:!content-none [&_code::after]:!content-none">
                    <SyntaxHighlighter
                      {...rest}
                      style={oneDark as any}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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
                className="rounded-lg bg-muted px-[0.4rem] py-[0.15rem] font-mono text-[13px] font-bold text-foreground/80 border border-border/10 [&::before]:!content-none [&::after]:!content-none"
                {...props}
              >
                {children}
              </code>
            )
          },

          // 引用块
          blockquote: ({ children }) => (
            <blockquote className="my-10 border-l-[4px] border-primary/20 bg-muted/20 py-4 pl-6 rounded-r-2xl pr-6 text-[16px] font-medium leading-relaxed italic text-foreground/70">
              {children}
            </blockquote>
          ),


          // 列表
          ul: ({ children }) => (
            <ul className="my-6 ml-6 list-disc space-y-2 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 ml-6 list-decimal space-y-2 marker:text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => {
            return (
              <li className="!text-foreground/90 text-[15px] sm:text-base leading-relaxed pl-1">
                {children}
              </li>
            )
          },

          strong: ({ children }) => (
            <strong className="font-semibold !text-foreground">{children}</strong>
          ),

          // 表格
          table: ({ children }) => (
            <div className="my-12 w-full overflow-hidden rounded-2xl border border-border/50 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-[14px]">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/40 border-b border-border/50">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-border/30 bg-card/10">{children}</tbody>,
          tr: ({ children }) => <tr className="transition-colors hover:bg-muted/30">{children}</tr>,
          th: ({ children }) => (
            <th className="px-5 py-4 text-left font-black !text-foreground uppercase tracking-widest text-[11px]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-5 py-4 align-middle !text-foreground/70 font-medium border-l border-border/10 first:border-l-0">
              {children}
            </td>
          ),

          // 分隔线
          hr: () => <hr className="border-border/40 my-12 border-t dark:border-white/20" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article >
  )
}
