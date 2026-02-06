'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { Calendar, Clock } from 'lucide-react'

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
    <header className="relative mb-20 space-y-12 text-center">
      <div className="mx-auto max-w-4xl px-4">
        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-foreground mb-8 text-5xl leading-[1.1] font-bold tracking-tighter sm:text-6xl md:text-7xl"
        >
          {title || '无标题文章'}
        </motion.h1>

        {/* 优化的作者信息和元数据展示 (Unified Minimalist Row) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm font-medium sm:gap-6 sm:text-base"
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            <UserAvatar
              user={userVO}
              size="sm"
              className="ring-background h-8 w-8 shadow-sm ring-2"
            />
            <span className="text-foreground font-semibold">{userVO?.userName || '匿名用户'}</span>
          </div>

          <span className="hidden opacity-30 sm:inline-block">•</span>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 opacity-70" />
            <time dateTime={createTime}>{formattedDate}</time>
          </div>

          <span className="hidden opacity-30 sm:inline-block">•</span>

          {/* Read Time */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-70" />
            <span>{readingTime} 分钟阅读</span>
          </div>
        </motion.div>

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-secondary/30 text-secondary-foreground border-transparent px-4 py-1.5 text-xs font-medium tracking-wider uppercase backdrop-blur-sm"
              >
                #{tag}
              </Badge>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  )
}
