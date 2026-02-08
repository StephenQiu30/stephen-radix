import * as React from 'react'
import Link from 'next/link'
import { Github, Search, UserCircle, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { AuthModal } from '@/components/auth/auth-modal'
import { UserDropdown } from '@/components/auth/user-dropdown'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { CommandMenu } from '@/components/search/command-menu'
import { Badge } from '@/components/ui/badge'
import { getUnreadCount } from '@/api/notification/notificationController'

interface HeaderActionsProps {
  onAuthModalOpenChange: (open: boolean) => void
  authModalOpen: boolean
}

export function HeaderActions({ onAuthModalOpenChange, authModalOpen }: HeaderActionsProps) {
  const { user } = useAppSelector((state: RootState) => state.user)
  const [open, setOpen] = React.useState(false)
  const [unreadCount, setUnreadCount] = React.useState(0)

  // Explicit keyboard shortcut listener (optional if CommandMenu handles it,
  // but good for ensuring it works even if CommandMenu isn't fully mounted/focused purely by its own effect)
  // Actually CommandMenu handles the effect, so we just need to pass the state setter.

  React.useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        try {
          const res = await getUnreadCount() as any
          if (res.code === 0 && res.data !== undefined) {
            setUnreadCount(Number(res.data))
          }
        } catch (error) {
          console.error('Failed to fetch unread count', error)
        }
      }

      fetchUnread()

      // Listen for real-time updates
      const handleUpdate = () => {
        fetchUnread()
      }
      window.addEventListener('notification-updated', handleUpdate)

      // Fallback polling
      const interval = setInterval(fetchUnread, 60000)

      return () => {
        window.removeEventListener('notification-updated', handleUpdate)
        clearInterval(interval)
      }
    }
  }, [user])

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-primary"
          onClick={() => setOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">搜索</span>
        </Button>
        <Link
          href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB || 'https://github.com/StephenQiu30'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Button>
        </Link>
        <ThemeToggle />

        {user ? (
          <>
            <Link href="/user/notifications">
              <Button variant="ghost" size="icon" className="relative hover:text-primary">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-4 min-w-4 px-1 py-0 text-[10px] flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
                <span className="sr-only">通知</span>
              </Button>
            </Link>
            <UserDropdown />
          </>
        ) : (
          <Button size="default" onClick={() => onAuthModalOpenChange(true)} className="gap-2">
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">登录</span>
          </Button>
        )}
      </div>
      <AuthModal open={authModalOpen} onOpenChange={onAuthModalOpenChange} />
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  )
}
