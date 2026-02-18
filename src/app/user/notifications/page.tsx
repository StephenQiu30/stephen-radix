'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Inbox,
    Loader2,
    MessageSquare,
    Info,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    listNotificationVoByPage,
    deleteNotification,
} from '@/api/notification/notificationController'
import type { RootState } from '@/store'
import { cn } from '@/lib/utils'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'
import { AuthModal } from '@/components/auth/auth-modal'

export default function NotificationsPage() {
    const router = useRouter()
    const { user } = useAppSelector((state: RootState) => state.user)
    const [authModalOpen, setAuthModalOpen] = React.useState(false)

    const [loading, setLoading] = React.useState(true)
    const [notifications, setNotifications] = React.useState<NotificationAPI.NotificationVO[]>([])
    const [total, setTotal] = React.useState(0)
    const [current, setCurrent] = React.useState(1)



    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            // Don't redirect immediately to avoid flashing, handled by rendering check
        } else {
            fetchNotifications()

            const handleUpdate = () => {
                if (current === 1) {
                    fetchNotifications()
                }
            }
            window.addEventListener('notification-updated', handleUpdate)
            return () => {
                window.removeEventListener('notification-updated', handleUpdate)
            }
        }
    }, [user, current])

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const res = await listNotificationVoByPage({
                current,
                pageSize: 10,
                sortField: 'create_time',
                sortOrder: 'descend',

            })
            if (res.code === 0 && res.data) {
                setNotifications(res.data.records || [])
                setTotal(res.data.total || 0)
            } else {
                toast.error(res.message || '获取通知失败', {
                    description: '请稍后重试',
                })
            }
        } catch (error) {
            toast.error('获取通知失败', {
                description: '网络错误，请稍后重试',
            })
        } finally {
            setLoading(false)
        }
    }



    const handleDelete = async (id: number) => {
        try {
            const res = await deleteNotification({ id })
            if (res.code === 0) {
                toast.success('删除成功', {
                    description: '通知已删除',
                })
                fetchNotifications()
            } else {
                toast.error('删除失败', {
                    description: res.message,
                })
            }
        } catch (error) {
            toast.error('删除失败', {
                description: '网络错误',
            })
        }
    }

    const getIcon = (type?: string) => {
        switch (type) {
            case 'system':
                return <Info className="h-5 w-5 text-blue-500" />
            case 'reply':
                return <MessageSquare className="h-5 w-5 text-green-500" />
            case 'like':
                return <CheckCheck className="h-5 w-5 text-pink-500" />
            default:
                return <Bell className="h-5 w-5 text-gray-500" />
        }
    }

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
        <div className="container mx-auto max-w-4xl space-y-8 py-8 md:py-12">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">消息通知</h1>
                    <p className="text-muted-foreground">
                        查看和管理您的系统通知和消息
                    </p>
                </div>
                <div className="flex gap-2">
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
                        <div className="bg-muted/50 rounded-full p-4">
                            <Inbox className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">暂无通知</h3>
                            <p className="text-muted-foreground">
                                目前没有任何消息通知。
                            </p>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {notifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card
                                    className={cn(
                                        'group relative overflow-hidden transition-all hover:shadow-md',
                                        notification.isRead === 0 ? 'bg-card border-l-4 border-l-primary' : 'bg-muted/30 opacity-70'
                                    )}
                                >
                                    <div className="flex p-4 sm:p-6">
                                        <div className="mr-4 mt-1 flex-shrink-0">
                                            <div className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full bg-secondary",
                                                notification.isRead === 0 && "bg-primary/10"
                                            )}>
                                                {getIcon(notification.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between">
                                                <h4 className={cn(
                                                    "font-semibold leading-none",
                                                    notification.isRead === 0 ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {notification.title}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                        {notification.createTime && new Date(notification.createTime).toLocaleString()}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                        onClick={() => notification.id && handleDelete(notification.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        <span className="sr-only">删除</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {notification.content}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Improved Pagination */}
            {total > 10 && (
                <div className="flex justify-center pt-8">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrent(p => Math.max(1, p - 1))}
                            disabled={current === 1 || loading}
                        >
                            上一页
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            第 {current} 页 / 共 {Math.ceil(total / 10)} 页
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrent(p => p + 1)}
                            disabled={current * 10 >= total || loading}
                        >
                            下一页
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
