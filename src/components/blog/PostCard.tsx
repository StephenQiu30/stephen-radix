'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/header/user-avatar'
import { Heart, Bookmark, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
    post: API.PostVO
    className?: string
}

export function PostCard({ post, className }: PostCardProps) {
    const {
        id,
        title,
        content,
        cover,
        tags,
        thumbNum = 0,
        favourNum = 0,
        createTime,
        userVO,
    } = post

    // 生成摘要 (取前 100 个字符)
    const excerpt = (content?.replace(/[#*`>\[\]]/g, '') || '').slice(0, 100) + ((content?.length ?? 0) > 100 ? '...' : '')

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
            initial="initial"
            whileHover="hover"
            className={cn('group h-full', className)}
        >
            <Link href={`/blog/${id}`} className="block h-full">
                <Card className="h-full overflow-hidden border-none bg-secondary/30 shadow-none backdrop-blur-sm transition-all duration-300 hover:bg-secondary/50">
                    <div className="flex h-full flex-col">
                        {/* 封面图 */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                            {cover ? (
                                <img
                                    src={cover}
                                    alt={title || ''}
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/50 to-muted p-6">
                                    <h3 className="line-clamp-3 text-center text-lg font-bold tracking-tight text-foreground/80">
                                        {title || 'No Title'}
                                    </h3>
                                </div>
                            )}

                            {/* Tags overlay */}
                            {tags && tags.length > 0 && (
                                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                                    {tags.slice(0, 2).map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-white/90 text-black shadow-sm backdrop-blur-md dark:bg-black/80 dark:text-white"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 内容区 */}
                        <div className="flex flex-1 flex-col p-6">
                            {/* 作者和日期 */}
                            <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <UserAvatar user={userVO} size="sm" />
                                    <span>{userVO?.userName || '匿名'}</span>
                                </div>
                                <span>{formattedDate}</span>
                            </div>

                            {/* 标题 */}
                            <h3 className="mb-3 line-clamp-2 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                {title || '无标题'}
                            </h3>

                            {/* 摘要 */}
                            <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                {excerpt}
                            </p>

                            {/* 底部互动 */}
                            <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                                <div className="flex items-center gap-4 text-muted-foreground/80">
                                    <span className="flex items-center gap-1.5 text-xs transition-colors hover:text-foreground">
                                        <Heart className="h-3.5 w-3.5" />
                                        {thumbNum}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs transition-colors hover:text-foreground">
                                        <Bookmark className="h-3.5 w-3.5" />
                                        {favourNum}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    阅读全文
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}
