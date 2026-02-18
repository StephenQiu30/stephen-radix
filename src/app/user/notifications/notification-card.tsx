'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Trash2, Bell, Check, MessageSquare, Heart, Info, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export interface NotificationCardProps {
    notification: NotificationAPI.NotificationVO
    onMarkRead: (notification: NotificationAPI.NotificationVO) => void
    onDelete: (id: number, e: React.MouseEvent) => void
}

export function NotificationCard({
    notification,
    onMarkRead,
    onDelete,
}: NotificationCardProps) {
    // Determine icon and color based on type
    const { icon, colorClass, gradientClass } = React.useMemo(() => {
        const type = notification.type || 'default'
        switch (type) {
            case 'system':
                return {
                    icon: <Info className="h-5 w-5 text-white" />,
                    colorClass: 'text-blue-500',
                    gradientClass: 'from-blue-500 to-blue-600',
                }
            case 'reply':
            case 'comment':
                return {
                    icon: <MessageSquare className="h-5 w-5 text-white" />,
                    colorClass: 'text-green-500',
                    gradientClass: 'from-green-500 to-green-600',
                }
            case 'like':
            case 'thumb':
                return {
                    icon: <Heart className="h-5 w-5 text-white fill-white" />,
                    colorClass: 'text-pink-500',
                    gradientClass: 'from-pink-500 to-rose-600',
                }
            case 'star':
            case 'favourite':
                return {
                    icon: <Star className="h-5 w-5 text-white fill-white" />,
                    colorClass: 'text-amber-500',
                    gradientClass: 'from-amber-400 to-orange-500',
                }
            default:
                return {
                    icon: <Bell className="h-5 w-5 text-white" />,
                    colorClass: 'text-purple-500',
                    gradientClass: 'from-violet-500 to-purple-600',
                }
        }
    }, [notification.type])

    // Clean up content
    const cleanContent = React.useMemo(() => {
        const raw = notification.content || ''
        return raw
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
            .replace(/[#*`>~_]/g, '')
            .trim()
    }, [notification.content])

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, height: 0, marginBottom: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="group relative"
        >
            <div
                role="button"
                tabIndex={0}
                onClick={() => onMarkRead(notification)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onMarkRead(notification)
                    }
                }}
                className={cn(
                    'relative flex cursor-pointer gap-4 p-4 transition-all duration-300 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'rounded-[22px] border',
                    // Apple Glassmorphism Style
                    notification.isRead === 0
                        ? 'bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-white/50 dark:border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.04)]'
                        : 'bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-zinc-800/60'
                )}
            >
                {/* Unread Indicator - Blue Dot */}
                {notification.isRead === 0 && (
                    <div className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.5)] ring-2 ring-white dark:ring-zinc-900" />
                )}

                {/* Icon Container - Squircle */}
                <div className="shrink-0 pt-1">
                    <div
                        className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-[12px] shadow-sm bg-gradient-to-br',
                            gradientClass
                        )}
                    >
                        {icon}
                    </div>
                </div>

                {/* Content Container */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between pr-6">
                        <h4
                            className={cn(
                                'text-[16px] leading-tight tracking-tight truncate',
                                notification.isRead === 0
                                    ? 'font-semibold text-foreground'
                                    : 'font-medium text-foreground/70'
                            )}
                        >
                            {notification.title || '新通知'}
                        </h4>
                        <span className="text-[12px] font-medium text-muted-foreground/50 shrink-0 tabular-nums">
                            {dayjs(notification.createTime).fromNow(true).replace(' ', '')}前
                        </span>
                    </div>

                    <p
                        className={cn(
                            'text-[14px] leading-relaxed line-clamp-2 text-pretty',
                            notification.isRead === 0 ? 'text-foreground/90' : 'text-muted-foreground/80'
                        )}
                    >
                        {cleanContent}
                    </p>
                </div>

                {/* Hover Actions (Delete) */}
                <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (notification.id) onDelete(notification.id, e)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
