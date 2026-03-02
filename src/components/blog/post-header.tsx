'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { Calendar, Clock, ChevronRight } from 'lucide-react'

interface PostHeaderProps {
  post: PostAPI.PostVO
}

export function PostHeader({ post }: PostHeaderProps) {
  const { title, cover, tags, createTime, userVO, content } = post

  // 估算阅读时间
  const readingTime = content ? Math.max(1, Math.ceil(content.length / 300)) : 1

  // 格式化日期
  const formattedDate = createTime
    ? new Date(createTime).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : ''

  return (
    <header className="relative mb-12 lg:mb-16 w-full">
      {/* 标题 - Apple Style (Tight tracking, ultra-bold) */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-foreground tracking-tighter text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[4rem] font-extrabold leading-[1.1] mb-8 text-balance"
      >
        {title || '无标题文章'}
      </motion.h1>

      {/* 标签与元数据信息 - 极其干净的居左布局 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-border/40"
      >
        <div className="flex items-center gap-3.5">
          <UserAvatar
            user={userVO}
            size="sm"
            className="ring-1 ring-black/5 dark:ring-white/10 h-11 w-11 shadow-sm"
          />
          <div className="flex flex-col flex-1">
            <span className="text-foreground font-semibold text-[15px] leading-snug">
              {userVO?.userName || '匿名作者'}
            </span>
            <div className="flex items-center gap-3 text-muted-foreground text-[13px] font-medium tracking-tight mt-0.5">
              <time dateTime={createTime}>{formattedDate}</time>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{readingTime} 分钟阅读</span>
            </div>
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground font-medium px-3 py-1 rounded-full text-xs transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>
    </header>
  )
}
