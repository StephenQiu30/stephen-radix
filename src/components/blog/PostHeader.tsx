'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { Calendar, Clock, Eye } from 'lucide-react'

interface PostHeaderProps {
    post: API.PostVO
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
        <header className="relative mb-16 space-y-12 text-center">
            {/* 封面图 (Placed First) */}


            <div className="space-y-8 max-w-4xl mx-auto px-4">
                {/* 标签 */}
                {tags && tags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap justify-center gap-2.5"
                    >
                        {tags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="bg-secondary/40 px-3 py-1 text-sm font-medium tracking-wide hover:bg-secondary/60 transition-colors"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </motion.div>
                )}

                {/* 标题 */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl text-foreground"
                >
                    {title || '无标题文章'}
                </motion.h1>

                {/* 优化的作者信息展示 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
                >
                    <div className="flex items-center gap-4 p-2 pr-6 rounded-full bg-secondary/30 backdrop-blur-sm border border-border/10">
                        <UserAvatar user={userVO} size="lg" className="h-12 w-12 border-2 border-background shadow-sm" />
                        <div className="text-left">
                            <p className="text-base font-semibold text-foreground">
                                {userVO?.userName || '匿名用户'}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                作者
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 opacity-70" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="h-4 w-px bg-border/50" />
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 opacity-70" />
                            <span>{readingTime} 分钟阅读</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    )
}

