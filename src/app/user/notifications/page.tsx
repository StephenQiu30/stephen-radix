'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { BellOff, Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import dayjs from '@/lib/dayjs'
import {
  deleteNotification,
  listMyNotificationVoByPage,
  markAllNotificationRead,
  markNotificationRead,
} from '@/api/notification/notificationController'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import type { RootState } from '@/store'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'
import { AuthModal } from '@/components/auth/auth-modal'
import { NotificationCard } from '@/components/notification/notification-card'

const TOAST_DURATION = 2000

export default function NotificationsPage() {
  const containerRef = React.useRef<HTMLDivElement>(null)
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
      const res = await listMyNotificationVoByPage({
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
        toast.error(res.message || '获取通知失败', { duration: TOAST_DURATION })
      }
    } catch (error) {
      toast.error('获取通知失败', { duration: TOAST_DURATION })
    } finally {
      setLoading(false)
    }
  }, [current, activeTab, user?.id])

  useGSAP(
    () => {
      if (!loading && user) {
        gsap.from('.animate-in', {
          opacity: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
        })
      }
    },
    { scope: containerRef, dependencies: [loading, user] }
  )

  React.useEffect(() => {
    if (user) {
      fetchNotifications()
      const handleUpdate = () => {
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
        toast.success('已删除', { duration: TOAST_DURATION })
        fetchNotifications()
      } else {
        toast.error('删除失败', { duration: TOAST_DURATION })
      }
    } catch (error) {
      toast.error('删除失败', { duration: TOAST_DURATION })
    }
  }

  const handleMarkRead = async (notification: NotificationAPI.NotificationVO) => {
    if (notification.isRead === 1) return
    try {
      const res = await markNotificationRead({ id: notification.id })
      if (res.code === 0) {
        setNotifications(prev =>
          prev.map(item => (item.id === notification.id ? { ...item, isRead: 1 } : item))
        )
      }
    } catch (error) {
      console.error('Mark read failed', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationRead()
      if (res.code === 0) {
        toast.success('全部已标记为已读', { duration: TOAST_DURATION })
        fetchNotifications()
      }
    } catch (error) {
      toast.error('操作失败', { duration: TOAST_DURATION })
    }
  }

  const handleView = (notification: NotificationAPI.NotificationVO) => {
    if (notification.contentUrl) {
      if (notification.contentUrl.startsWith('http')) {
        window.open(notification.contentUrl, '_blank')
      } else {
        router.push(notification.contentUrl)
      }
      return
    }

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
      <div className="bg-background relative min-h-screen w-full">
        <div className="relative z-10 flex min-h-[80vh] w-full items-center justify-center px-6">
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
    <div ref={containerRef} className="bg-background relative min-h-screen w-full selection:bg-primary/20">
      <div className="relative z-10 mx-auto w-full container px-6 pt-16 pb-40">
        {/* Header - Minimalist Typography */}
        <div className="animate-in mb-12 space-y-6">
          <div className="space-y-3">
            <h1 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              通知中心
            </h1>
            <p className="text-foreground/80 max-w-xl text-lg font-bold tracking-tight">
              您的全部动态、互动与系统提醒。随时掌握最新进展。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-border/10">
            <div className="flex items-center gap-4">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-fit">
                <TabsList className="bg-muted/30 rounded-full p-1.5 backdrop-blur-2xl border border-border/10">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-full px-10 h-10 text-[13px] font-black tracking-tight transition-all duration-300"
                  >
                    全部
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-full px-10 h-10 text-[13px] font-black tracking-tight transition-all duration-300"
                  >
                    未读
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {activeTab === 'unread' && notifications.some(n => n.isRead === 0) && (
              <Button
                variant="outline"
                className="h-10 rounded-full px-6 text-[13px] font-bold tracking-tight border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                onClick={handleMarkAllRead}
              >
                <Check className="mr-1.5 h-4 w-4" />
                一键已读
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {loading ? (
            <LoadingSkeleton type="list" count={5} />
          ) : notifications.length === 0 ? (
            <div className="animate-in flex flex-col items-center justify-center space-y-8 py-40 text-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-[38px] bg-muted/40 shadow-sm border border-border/10">
                <BellOff className="text-foreground/30 h-14 w-14" />
              </div>
              <div className="max-w-md space-y-4 px-6">
                <h3 className="text-foreground text-3xl font-black tracking-tighter">
                  {activeTab === 'unread' ? '已读完所有通知' : '空空如也'}
                </h3>
                <p className="text-foreground/70 text-lg font-bold tracking-tight leading-relaxed">
                  {activeTab === 'unread' ? '现在您可以享受专注时光了。' : '当有新的社群互动或系统更新时，我们将第一时间告知您。'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {groupedNotifications.map(([group, items]) => (
                <div key={group} className="animate-in space-y-8">
                  <div className="sticky top-[80px] z-20 -mx-4 px-4 py-4 bg-background/5 backdrop-blur-md">
                    <h2 className="text-foreground/50 text-[11px] font-black tracking-[0.2em] uppercase">
                      {group}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 15 && (
          <div className="animate-in mt-24 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-border/10 bg-muted/20 p-2 backdrop-blur-2xl">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-background/80"
                onClick={() => setCurrent(p => Math.max(1, p - 1))}
                disabled={current === 1 || loading}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-foreground/60 min-w-[4rem] px-4 text-center text-sm font-bold tracking-tighter tabular-nums">
                {current} / {Math.ceil(total / 15)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-background/80"
                onClick={() => setCurrent(p => p + 1)}
                disabled={current * 15 >= total || loading}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
