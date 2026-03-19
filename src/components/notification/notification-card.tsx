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
  const { icon, colorClass } = React.useMemo(() => {
    const type = notification.type || 'default'
    switch (type) {
      case 'system':
        return {
          icon: <Info className="h-4 w-4" />,
          colorClass: 'text-primary',
        }
      case 'reply':
      case 'comment':
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          colorClass: 'text-primary',
        }
      case 'like':
      case 'thumb':
        return {
          icon: <Heart className="h-4 w-4 fill-current" />,
          colorClass: 'text-primary',
        }
      case 'star':
      case 'favourite':
        return {
          icon: <Star className="h-4 w-4 fill-current" />,
          colorClass: 'text-primary',
        }
      default:
        return {
          icon: <Bell className="h-4 w-4" />,
          colorClass: 'text-primary',
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
          'ring-offset-background focus-visible:ring-ring relative flex cursor-pointer gap-5 p-5 transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'rounded-[2rem] border border-border/5 hover:border-primary/10 hover:shadow-[0_8px_40px_rgba(0,0,0,0.03)]',
          notification.isRead === 0
            ? 'bg-card/40 backdrop-blur-2xl'
            : 'bg-transparent opacity-60 grayscale-[0.5] hover:bg-card/20 hover:opacity-100 hover:grayscale-0'
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
              'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500',
              'group-hover:scale-110 group-active:scale-95 border border-border/5',
              notification.isRead === 0
                ? 'bg-primary/5 text-primary shadow-sm'
                : 'bg-muted/10 text-foreground/20'
            )}
          >
            {icon}
          </div>
        </div>

        {/* Content Container */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <h4
              className={cn(
                'truncate text-[15px] leading-tight tracking-tight px-0.5 transition-all duration-500',
                notification.isRead === 0
                  ? 'text-foreground font-black'
                  : 'text-foreground font-bold opacity-70'
              )}
            >
              {notification.title || '新通知'}
            </h4>
            <span className="text-foreground/40 shrink-0 text-[10px] font-black tracking-widest uppercase tabular-nums">
              {dayjs(notification.createTime).fromNow()}
            </span>
          </div>

          <p
            className={cn(
              'line-clamp-2 text-[13px] leading-relaxed text-pretty px-0.5 transition-all duration-500',
              notification.isRead === 0 ? 'text-foreground/80 font-bold' : 'text-foreground/60 font-medium'
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
