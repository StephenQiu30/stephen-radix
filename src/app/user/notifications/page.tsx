'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
    Check,
    Loader2,
    Sparkles,
    BellOff,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    listNotificationVoByPage,
    deleteNotification,
    markRead,
    markAllRead,
} from '@/api/notification/notificationController'
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
                pageSize: 20,
                sortField: 'create_time',
                sortOrder: 'descend',
            })
            if (res.code === 0 && res.data) {
                setNotifications(res.data.records || [])
                setTotal(res.data.total || 0)
            } else {
                toast.error(res.message || '获取通知失败')
            }
        } catch (error) {
            toast.error('获取通知失败')
        } finally {
            setLoading(false)
        }
    }, [current])

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
                setNotifications((prev) =>
                    prev.map((item) => (item.id === notification.id ? { ...item, isRead: 1 } : item))
                )
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

    // Grouping
    const groupedNotifications = React.useMemo(() => {
        const groups: Record<string, NotificationAPI.NotificationVO[]> = {
            今天: [],
            昨天: [],
            更早: [],
        }

        notifications.forEach((note) => {
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
            <>
                <LoginPromptCard
                    onLoginClick={() => setAuthModalOpen(true)}
                    title="需要登录"
                    description="请登录以查看系统通知"
                />
                <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
            </>
        )
    }

    return (
        <div className="relative min-h-screen w-full bg-background selection:bg-blue-500/30">
            {/* 
        Apple-style Mesh Gradient Background 
        - Subtle, moving, deeply blurred.
      */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-blue-400/10 dark:bg-blue-900/10 blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" />
                <div className="absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-400/10 dark:bg-indigo-900/10 blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-70" />
            </div>

            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-20">

                {/* Header - iOS style Large Title */}
                <div className="flex items-end justify-between mb-8 px-1">
                    <div>
                        <h1 className="text-[34px] font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight">
                            通知中心
                        </h1>
                    </div>
                    {notifications.some((n) => n.isRead === 0) && (
                        <Button
                            variant="ghost"
                            className="rounded-full text-[#007AFF] hover:text-[#007AFF] hover:bg-[#007AFF]/10 font-medium text-[15px] px-4 h-9"
                            onClick={handleMarkAllRead}
                        >
                            <Check className="mr-1.5 h-4 w-4" />
                            全部已读
                        </Button>
                    )}
                </div>

                {/* Content Area */}
                <div className="min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-8 h-8 text-black/20 dark:text-white/20 animate-spin" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                            <div className="h-24 w-24 rounded-[28px] bg-gradient-to-br from-white/80 to-white/40 dark:from-zinc-800/80 dark:to-zinc-800/40 backdrop-blur-xl shadow-lg flex items-center justify-center">
                                <BellOff className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-foreground/80">暂无通知</h3>
                                <p className="text-muted-foreground/60 text-sm">
                                    当有新的互动时，它们会出现在这里
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <AnimatePresence mode="popLayout">
                                {groupedNotifications.map(([group, items], groupIndex) => (
                                    <motion.div
                                        key={group}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: groupIndex * 0.08, duration: 0.4 }}
                                        className="space-y-3"
                                    >
                                        {/* Sticky Section Header - iOS Style */}
                                        <div className="sticky top-[72px] z-20 px-1 py-2 backdrop-blur-xl -mx-4 px-4 bg-[#F5F5F7]/80 dark:bg-black/80 supports-[backdrop-filter]:bg-transparent">
                                            <h2 className="text-[19px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                                                {group}
                                            </h2>
                                        </div>

                                        <div className="grid gap-3">
                                            {items.map((notification) => (
                                                <NotificationCard
                                                    key={notification.id}
                                                    notification={notification}
                                                    onMarkRead={handleMarkRead}
                                                    onDelete={handleDelete}
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
                    <div className="mt-12 flex justify-center pb-12">
                        <div className="flex items-center gap-1 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-xl shadow-sm rounded-full p-1.5 ring-1 ring-black/5 dark:ring-white/10">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setCurrent((p) => Math.max(1, p - 1))}
                                disabled={current === 1 || loading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-[13px] font-medium px-3 tabular-nums min-w-[3rem] text-center text-secondary-foreground/80">
                                {current} / {Math.ceil(total / 20)}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setCurrent((p) => p + 1)}
                                disabled={current * 20 >= total || loading}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
