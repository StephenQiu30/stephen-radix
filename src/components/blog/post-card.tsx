'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { ArrowUpRight, Bookmark, Heart, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: PostAPI.PostVO
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const { id, title, content, cover, tags, thumbNum = 0, favourNum = 0, createTime, userVO } = post

  // 生成摘要 (取前 100 个字符，移除 Markdown 符号)
  const excerpt =
    (
      content
        ?.replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // Remove links but keep text
        .replace(/[#*`>~_]/g, '') // Remove other markdown symbols
        .trim() || ''
    ).slice(0, 100) + ((content?.length ?? 0) > 100 ? '...' : '')

  // 格式化日期
  const formattedDate = createTime
    ? new Date(createTime).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : ''

  return (
    <motion.div initial="initial" whileHover="hover" className={cn('group h-full block relative', className)}>
      <div className="bg-card hover:bg-card/90 relative flex h-full flex-col overflow-hidden rounded-[32px] border border-border shadow-sm hover:shadow-md transition-all duration-300">

        {/* 封面图 */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 dark:bg-muted/20">
          {cover ? (
            <img
              src={cover}
              alt={title || ''}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105',
                'bg-muted/50 dark:bg-muted/10'
              )}
            >
              {/* Subtle Grid Pattern */}
              <div className="bg-grid-black/[0.03] dark:bg-grid-white/[0.03] absolute inset-0 z-0" />

              {/* Title Display */}
              <div className="relative z-10 flex w-full flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-background/60 border border-border/50 shadow-sm backdrop-blur-md">
                  <FileText className="text-muted-foreground/80 h-6 w-6" />
                </div>
                <h3 className="text-foreground/90 line-clamp-3 text-xl leading-snug font-bold tracking-tight md:text-2xl">
                  {title || '无标题'}
                </h3>
              </div>
            </div>
          )}

          {/* Overlay Gradient for readability of tags/overlay interactions */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-[15]" />

          {/* Tags overlay */}
          {tags && tags.length > 0 && (
            <div className="pointer-events-none absolute top-4 left-4 flex flex-wrap gap-2 z-20">
              {tags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-background/80 text-foreground/90 border border-border shadow-sm backdrop-blur-md"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 内容区 */}
        <div className="flex flex-1 flex-col p-5 sm:p-6 bg-card relative z-10 pointer-events-none">
          {/* 作者和日期 */}
          <div className="text-muted-foreground/80 mb-4 flex items-center justify-between text-xs font-medium tracking-wider uppercase">
            {/* Author Link (Z-Index > 0 to sit above overlay, pointer events auto) */}
            <div className="relative z-30 flex items-center gap-2 pointer-events-auto">
              <Link
                href={`/user/${userVO?.id}`}
                className="group/author flex items-center gap-2 rounded-full py-1 pr-3 hover:bg-secondary/50 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <UserAvatar user={userVO} size="sm" className="h-6 w-6 border border-border" />
                <span className="group-hover/author:text-primary transition-colors text-foreground font-semibold">
                  {userVO?.userName || '匿名'}
                </span>
              </Link>
            </div>
            <span className="px-1">{formattedDate}</span>
          </div>

          {/* 标题 */}
          <h3 className="text-foreground group-hover:text-primary mb-3 line-clamp-2 text-xl font-bold tracking-tight transition-colors duration-300">
            {title || '无标题'}
          </h3>

          {/* 摘要 */}
          <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed">
            {excerpt}
          </p>

          {/* 底部互动 */}
          <div className="border-border/60 mt-auto flex items-center justify-between border-t pt-4">
            <div className="text-muted-foreground/70 flex items-center gap-4">
              <span className="hover:text-foreground flex items-center gap-1.5 text-xs font-medium transition-colors">
                <Heart className="h-3.5 w-3.5" />
                {thumbNum}
              </span>
              <span className="hover:text-foreground flex items-center gap-1.5 text-xs font-medium transition-colors">
                <Bookmark className="h-3.5 w-3.5" />
                {favourNum}
              </span>
            </div>

            <div className="text-primary flex translate-x-2 transform items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              阅读全文
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Main Card Link (Overlay) - Placed at the end with absolute positioning to cover everything except explicitly raised interactive elements */}
        <Link href={`/blog/${id}`} className="absolute inset-0 z-20">
          <span className="sr-only">View Post</span>
        </Link>
      </div>
    </motion.div>
  )
}
