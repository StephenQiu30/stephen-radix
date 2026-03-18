'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell, Heart, Info, MessageSquare, Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from '@/lib/dayjs'

export interface NotificationCardProps {
  notification: NotificationAPI.NotificationVO
  onMarkRead: (notification: NotificationAPI.NotificationVO) => void
  onDelete: (id: number, e: React.MouseEvent) => void
  onView?: (notification: NotificationAPI.NotificationVO) => void
}

export function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  onView,
}: NotificationCardProps) {
  // Determine icon and color based on type
  const { icon, colorClass, gradientClass } = React.useMemo(() => {
    const type = notification.type || 'default'
    switch (type) {
      case 'system':
        return {
          icon: <Info className="h-4 w-4" />,
          colorClass: 'text-blue-500',
          gradientClass: 'from-blue-500 to-blue-600',
        }
      case 'reply':
      case 'comment':
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          colorClass: 'text-green-500',
          gradientClass: 'from-green-500 to-green-600',
        }
      case 'like':
      case 'thumb':
        return {
          icon: <Heart className="h-4 w-4 fill-current" />,
          colorClass: 'text-pink-500',
          gradientClass: 'from-pink-500 to-rose-600',
        }
      case 'star':
      case 'favourite':
        return {
          icon: <Star className="h-4 w-4 fill-current" />,
          colorClass: 'text-amber-500',
          gradientClass: 'from-amber-400 to-orange-500',
        }
      default:
        return {
          icon: <Bell className="h-4 w-4" />,
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
    <div className="animate-in group relative">
      <Card
        role="button"
        tabIndex={0}
        onClick={() => {
          onMarkRead(notification)
          onView?.(notification)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onMarkRead(notification)
            onView?.(notification)
          }
        }}
        className={cn(
          'ring-offset-background focus-visible:ring-ring relative flex cursor-pointer gap-3 p-4 transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'rounded-[20px] border border-border/10 hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.02)]',
          notification.isRead === 0
            ? 'bg-muted/50'
            : 'bg-transparent opacity-60 grayscale-[0.2] hover:bg-muted/10 hover:opacity-100'
        )}
      >
        {/* Unread Indicator */}
        {notification.isRead === 0 && (
          <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
        )}

        {/* Icon Container */}
        <div className="shrink-0">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-[12px] transition-all duration-500',
              'group-hover:scale-110 group-active:scale-95 border border-transparent',
              notification.isRead === 0
                ? 'bg-muted/40 text-foreground/60 border-border/10 shadow-sm'
                : 'bg-muted/20 text-foreground/30'
            )}
          >
            {icon}
          </div>
        </div>

        {/* Content Container */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between pr-4">
            <h4
              className={cn(
                'truncate text-[16px] leading-tight tracking-tight px-1 transition-all duration-500',
                notification.isRead === 0
                  ? 'text-foreground font-black'
                  : 'text-foreground/90 font-bold'
              )}
            >
              {notification.title || '新通知'}
            </h4>
            <span className="text-foreground/20 shrink-0 text-[11px] font-black tracking-tighter uppercase tabular-nums">
              {dayjs(notification.createTime).fromNow()}
            </span>
          </div>

          <p
            className={cn(
              'line-clamp-2 text-[14px] leading-relaxed text-pretty px-1 transition-all duration-500',
              notification.isRead === 0 ? 'text-foreground font-bold' : 'text-foreground/70 font-medium'
            )}
          >
            {cleanContent}
          </p>
        </div>

        {/* Hover Actions */}
        <div className="absolute right-3 bottom-3 flex items-center gap-2 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-md hover:bg-destructive shadow-sm hover:text-destructive-foreground transition-all duration-300"
            onClick={e => {
              e.stopPropagation()
              if (notification.id) onDelete(notification.id, e)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
