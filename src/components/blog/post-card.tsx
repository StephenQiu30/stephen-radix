'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { ArrowRight, ArrowUpRight, Bookmark, Heart, FileText } from 'lucide-react'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={cn('group h-full block relative will-change-transform', className)}
    >
      <div className="bg-card/40 border-border/20 flex h-full flex-col overflow-hidden rounded-[2rem] border backdrop-blur-2xl shadow-sm hover:bg-card/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500">

        {/* 内容区首部 - Meta */}
        <div className="border-border/10 border-b p-6 pb-5 flex items-start gap-4">
          <Link
            href={`/user/${userVO?.id}`}
            className="shrink-0 transition-transform duration-300 group-hover:scale-105"
            onClick={e => e.stopPropagation()}
          >
            <UserAvatar user={userVO} size="sm" className="h-10 w-10 ring-1 ring-border/50 shadow-sm" />
          </Link>
          <div className="space-y-1 pt-0.5">
            <Link href={`/user/${userVO?.id}`} onClick={e => e.stopPropagation()}>
              <h4 className="text-foreground hover:text-primary text-[15px] font-bold tracking-tight transition-colors leading-none">
                {userVO?.userName || '匿名作者'}
              </h4>
            </Link>
            <div className="text-muted-foreground/80 flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* 封面区 (内嵌在中间, 更像内容图) */}
        {cover && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/20 border-b border-border/10">
            <img
              src={cover}
              alt={title || ''}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        )}

        {/* 内容区主体 */}
        <div className="flex flex-1 flex-col p-6 relative z-10 space-y-4">

          {/* 标签 */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full border-primary/20 bg-primary/5 text-primary/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors group-hover:border-primary/40 group-hover:text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* 标题 */}
          <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-xl leading-snug font-bold tracking-tight transition-colors duration-300">
            {title || '无标题'}
          </h3>

          {/* 摘要 */}
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {excerpt}
          </p>

        </div>

        {/* 底部互动 */}
        <div className="border-border/10 flex items-center justify-between border-t p-5 px-6">
          <div className="text-muted-foreground/70 flex items-center gap-4">
            <span className="hover:text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors">
              <Heart className="h-4 w-4" />
              {thumbNum}
            </span>
            <span className="hover:text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors">
              <Bookmark className="h-4 w-4" />
              {favourNum}
            </span>
          </div>

          <div className="bg-zinc-900/5 text-zinc-900 hover:bg-zinc-900/10 dark:bg-zinc-50/5 dark:text-zinc-50 dark:hover:bg-zinc-50/10 flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 active:scale-95 group/btn">
            阅读
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </div>
        </div>

        {/* Main Card Link (Overlay) */}
        <Link href={`/blog/${id}`} className="absolute inset-0 z-20">
          <span className="sr-only">View Post</span>
        </Link>
      </div>
    </motion.div>
  )
}
