'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { ArrowUpRight, Bookmark, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: API.PostVO
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const { id, title, content, cover, tags, thumbNum = 0, favourNum = 0, createTime, userVO } = post

  // 生成摘要 (取前 100 个字符，移除 Markdown 符号)
  const excerpt =
    (content
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
    <motion.div initial="initial" whileHover="hover" className={cn('group h-full', className)}>
      <div className="bg-secondary/30 hover:bg-secondary/50 relative flex h-full flex-col overflow-hidden rounded-[32px] border-none shadow-none backdrop-blur-sm transition-all duration-300">
        {/* Main Card Link (Overlay) */}
        <Link href={`/blog/${id}`} className="absolute inset-0 z-0">
          <span className="sr-only">View Post</span>
        </Link>
        {/* 封面图 */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={title || ''}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-colors duration-500',
                // Minimalist backgrounds: softly tinted grays/whites or extremely subtle gradients
                'bg-secondary/20'
              )}
            >
              {/* Very Subtle Gradient Overlay for depth */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-30',
                  'from-primary/10 to-transparent dark:from-primary/20'
                )}
              />

              {/* Subtle Grid Pattern */}
              <div className="bg-grid-black/[0.015] dark:bg-grid-white/[0.015] absolute inset-0" />

              {/* Title Display */}
              <div className="relative z-10 w-full transition-transform duration-500 group-hover:scale-105">
                <h3 className="text-foreground/80 line-clamp-3 text-xl leading-snug font-bold tracking-tight md:text-2xl">
                  {title || '无标题'}
                </h3>
                <div className="bg-foreground/10 group-hover:bg-primary/20 mx-auto mt-4 h-1 w-12 rounded-full transition-colors" />
              </div>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

          {/* Tags overlay */}
          {tags && tags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
              {tags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-background/80 text-foreground/90 border border-white/20 shadow-sm backdrop-blur-md"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 内容区 */}
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          {/* 作者和日期 */}
          <div className="text-muted-foreground/60 mb-3 flex items-center justify-between text-xs font-medium tracking-wider uppercase">
            {/* Author Link (Z-Index > 0 to sit above overlay) */}
            <div className="relative z-10 flex items-center gap-2">
              <Link
                href={`/user/${userVO?.id}`}
                className="group/author flex items-center gap-2"
                onClick={e => e.stopPropagation()}
              >
                <UserAvatar user={userVO} size="sm" className="h-5 w-5" />
                <span className="group-hover/author:text-primary transition-colors">
                  {userVO?.userName || '匿名'}
                </span>
              </Link>
            </div>
            <span>{formattedDate}</span>
          </div>

          {/* 标题 */}
          <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-lg font-bold tracking-tight transition-colors duration-300 sm:mb-3 sm:text-xl">
            {title || '无标题'}
          </h3>

          {/* 摘要 */}
          <p className="text-muted-foreground mb-4 line-clamp-3 text-xs leading-relaxed sm:mb-6 sm:text-sm">
            {excerpt}
          </p>

          {/* 底部互动 */}
          <div className="border-border/40 mt-auto flex items-center justify-between border-t pt-4">
            <div className="text-muted-foreground/70 flex items-center gap-4">
              <span className="hover:text-foreground flex items-center gap-1.5 text-xs transition-colors">
                <Heart className="h-3.5 w-3.5" />
                {thumbNum}
              </span>
              <span className="hover:text-foreground flex items-center gap-1.5 text-xs transition-colors">
                <Bookmark className="h-3.5 w-3.5" />
                {favourNum}
              </span>
            </div>

            <div className="text-primary flex translate-x-2 transform items-center gap-1 text-xs font-medium opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              阅读全文
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div >
  )
}
