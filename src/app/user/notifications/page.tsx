'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { BellOff, Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  deleteNotification,
  listNotificationVoByPage,
  markAllRead,
  markRead,
} from '@/api/notification/notificationController'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import type { RootState } from '@/store'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'
import { AuthModal } from '@/components/auth/auth-modal'
import { NotificationCard } from './notification-card'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useAppSelector((state: RootState) => state.user)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  const [activeTab, setActiveTab] = React.useState('unread')
  const [loading, setLoading] = React.useState(true)
  const [notifications, setNotifications] = React.useState<NotificationAPI.NotificationVO[]>([])
  const [total, setTotal] = React.useState(0)
  const [current, setCurrent] = React.useState(1)

  // Fetch logic
  const fetchNotifications = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await listNotificationVoByPage({
        current,
        pageSize: 15,
        sortField: 'createTime',
        sortOrder: 'descend',
        isRead: activeTab === 'unread' ? 0 : undefined,
      })
      if (res.code === 0 && res.data) {
        setNotifications((res.data.records as NotificationAPI.NotificationVO[]) || [])
        setTotal(Number(res.data.total) || 0)
      } else {
        toast.error(res.message || '获取通知失败')
      }
    } catch (error) {
      toast.error('获取通知失败')
    } finally {
      setLoading(false)
    }
  }, [current, activeTab, user?.id])

  React.useEffect(() => {
    if (user) {
      fetchNotifications()
      const handleUpdate = () => {
        // Refresh if we are on the first page or if it might affect current view
        if (current === 1) fetchNotifications()
      }
      window.addEventListener('notification-updated', handleUpdate)
      return () => window.removeEventListener('notification-updated', handleUpdate)
    }
  }, [user, current, fetchNotifications])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrent(1)
  }

  // Actions
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await deleteNotification({ id })
      if (res.code === 0) {
        toast.success('已删除')
        fetchNotifications()
      } else {
        toast.error('删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  const handleMarkRead = async (notification: NotificationAPI.NotificationVO) => {
    if (notification.isRead === 1) return
    try {
      const res = await markRead({ id: notification.id })
      if (res.code === 0) {
        // If we are in 'unread' tab, removing it from view might be abrupt, but standard behavior.
        // However, user might misclick.
        // For now, let's just update locally.
        setNotifications(prev =>
          prev.map(item => (item.id === notification.id ? { ...item, isRead: 1 } : item))
        )
        // If in unread tab, maybe fetch again or filter out?
        // Let's keep it visible but marked read until refresh/tab switch to avoid layout jump.
      }
    } catch (error) {
      console.error('Mark read failed', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllRead()
      if (res.code === 0) {
        toast.success('全部已读')
        fetchNotifications()
      }
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const handleView = (notification: NotificationAPI.NotificationVO) => {
    // 1. Check contentUrl
    if (notification.contentUrl) {
      if (notification.contentUrl.startsWith('http')) {
        window.open(notification.contentUrl, '_blank')
      } else {
        router.push(notification.contentUrl)
      }
      return
    }

    // 2. Check relatedType and relatedId
    if (notification.relatedType && notification.relatedId) {
      switch (notification.relatedType) {
        case 'post':
        case 'comment':
        case 'reply':
        case 'like':
          router.push(`/blog/${notification.relatedId}`)
          break
        default:
          console.warn('Unknown relatedType', notification.relatedType)
      }
    }
  }

  // Grouping
  const groupedNotifications = React.useMemo(() => {
    const groups: Record<string, NotificationAPI.NotificationVO[]> = {
      今天: [],
      昨天: [],
      更早: [],
    }

    notifications.forEach(note => {
      if (!note.createTime) {
        groups['更早'].push(note)
        return
      }
      const date = dayjs(note.createTime)
      if (date.isSame(dayjs(), 'day')) {
        groups['今天'].push(note)
      } else if (date.isSame(dayjs().subtract(1, 'day'), 'day')) {
        groups['昨天'].push(note)
      } else {
        groups['更早'].push(note)
      }
    })

    return Object.entries(groups).filter(([_, items]) => items.length > 0)
  }, [notifications])

  if (!user) {
    return (
      <div className="bg-background relative min-h-screen w-full selection:bg-blue-500/30">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] h-[80vw] w-[80vw] animate-pulse rounded-full bg-blue-400/10 opacity-70 mix-blend-multiply blur-[130px] dark:bg-blue-900/10 dark:mix-blend-screen" />
          <div className="absolute top-[10%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-indigo-400/10 opacity-70 mix-blend-multiply blur-[130px] dark:bg-indigo-900/10 dark:mix-blend-screen" />
        </div>

        <div className="relative z-10 flex min-h-[80vh] w-full items-center justify-center px-6 pt-24 pb-20 sm:px-10 lg:pl-12">
          <LoginPromptCard
            onLoginClick={() => setAuthModalOpen(true)}
            title="需要登录"
            description="请登录以查看系统通知"
          />
          <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background relative min-h-screen w-full selection:bg-blue-500/30">
      {/* 
        Apple-style Mesh Gradient Background 
        - Subtle, moving, deeply blurred.
      */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[80vw] w-[80vw] animate-pulse rounded-full bg-blue-400/10 opacity-70 mix-blend-multiply blur-[130px] dark:bg-blue-900/10 dark:mix-blend-screen" />
        <div className="absolute top-[10%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-indigo-400/10 opacity-70 mix-blend-multiply blur-[130px] dark:bg-indigo-900/10 dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full px-6 pt-24 pb-20 sm:px-10 lg:pl-12">
        {/* Header - iOS style Large Title - Left Aligned */}
        <div className="mb-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[34px] leading-tight font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              通知中心
            </h1>
            <p className="text-[#86868B] text-sm font-medium tracking-tight">
              查看你的全部互动与系统提醒
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-fit">
              <TabsList className="bg-[#1D1D1F]/5 rounded-full p-1 dark:bg-white/5">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white rounded-full px-6 text-[14px] font-semibold tracking-tight transition-all data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:data-[state=active]:bg-zinc-800"
                >
                  全部
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="data-[state=active]:bg-white rounded-full px-6 text-[14px] font-semibold tracking-tight transition-all data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:data-[state=active]:bg-zinc-800"
                >
                  未读
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === 'unread' && notifications.some(n => n.isRead === 0) && (
              <Button
                variant="ghost"
                className="h-9 w-fit rounded-full px-4 text-[14px] font-semibold text-[#007AFF] hover:bg-[#007AFF]/10"
                onClick={handleMarkAllRead}
              >
                <Check className="mr-1.5 h-4 w-4 stroke-[2.5]" />
                全部标记为已读
              </Button>
            )}
          </div>

          {/* Content Area - Full width but left aligned */}
          <div className="w-full">
            {loading ? (
              <LoadingSkeleton type="list" count={5} />
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-32 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-white/80 to-white/40 shadow-lg backdrop-blur-xl dark:from-zinc-800/80 dark:to-zinc-800/40">
                  <BellOff className="text-muted-foreground/40 h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-foreground/80 text-xl font-semibold">
                    {activeTab === 'unread' ? '没有未读通知' : '暂无通知'}
                  </h3>
                  <p className="text-muted-foreground/60 text-sm">
                    {activeTab === 'unread' ? '你已读完所有通知' : '当有新的互动时，它们会出现在这里'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {groupedNotifications.map(([group, items], groupIndex) => (
                    <motion.div
                      key={group}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: groupIndex * 0.08, duration: 0.4 }}
                      className="space-y-2"
                    >
                      {/* Sticky Section Header - iOS Style */}
                      <div className="sticky top-[72px] z-20 -mx-4 bg-[#F5F5F7]/80 px-4 py-2 backdrop-blur-xl supports-[backdrop-filter]:bg-transparent dark:bg-black/80">
                        <h2 className="text-[#86868B] text-[13px] font-bold tracking-[0.05em] uppercase">
                          {group}
                        </h2>
                      </div>

                      <div className="grid gap-2">
                        {items.map(notification => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onMarkRead={handleMarkRead}
                            onDelete={handleDelete}
                            onView={handleView}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Pagination - iOS style 'Load More' feel */}
          {total > 20 && (
            <div className="mt-16 flex justify-center pb-12">
              <div className="flex items-center gap-1 rounded-full border border-white/40 bg-white/60 p-1.5 shadow-[0_10px_20px_rgba(0,0,0,0.04)] backdrop-blur-2xl dark:border-white/5 dark:bg-zinc-800/60">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setCurrent(p => Math.max(1, p - 1))}
                  disabled={current === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-secondary-foreground/80 min-w-[3rem] px-3 text-center text-[13px] font-medium tabular-nums">
                  {current} / {Math.ceil(total / 20)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setCurrent(p => p + 1)}
                  disabled={current * 20 >= total || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
