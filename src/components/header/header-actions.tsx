import * as React from 'react'
import Link from 'next/link'
import { Bell, Github, Search, UserCircle, PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { AuthModal } from '@/components/auth/auth-modal'
import { UserDropdown } from '@/components/auth/user-dropdown'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { CommandMenu } from '@/components/search/command-menu'
import { getNotificationUnreadCount } from '@/api/notification/notificationController'

interface HeaderActionsProps {
  onAuthModalOpenChange: (open: boolean) => void
  authModalOpen: boolean
}

export function HeaderActions({ onAuthModalOpenChange, authModalOpen }: HeaderActionsProps) {
  const { user } = useAppSelector((state: RootState) => state.user)
  const [open, setOpen] = React.useState(false)
  const [unreadCount, setUnreadCount] = React.useState(0)

  const fetchUnreadCount = React.useCallback(async () => {
    if (!user) return
    try {
      const res = await getNotificationUnreadCount()
      if (res.code === 0) {
        setUnreadCount(Number(res.data) || 0)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }, [user])

  React.useEffect(() => {
    fetchUnreadCount()

    const handleUpdate = () => {
      fetchUnreadCount()
    }

    window.addEventListener('notification-updated', handleUpdate)
    return () => window.removeEventListener('notification-updated', handleUpdate)
  }, [fetchUnreadCount])

  return (
    <>
      <div className="flex items-center gap-1.5 md:gap-2">
        <div className="hidden sm:flex items-center gap-1.5 h-9">
          <Button
            variant="ghost"
            size="icon"
            className="action-item h-9 w-9 rounded-full shrink-0 flex items-center justify-center m-0 p-0 text-muted-foreground hover:bg-transparent hover:text-foreground transition-colors"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="action-item h-9 w-9 rounded-full shrink-0 flex items-center justify-center m-0 p-0 text-muted-foreground hover:bg-transparent hover:text-foreground transition-colors"
          >
            <Link
              href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB || 'https://github.com/StephenQiu30'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </Link>
          </Button>
          <div className="action-item h-9 w-9 flex items-center justify-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="action-item sm:hidden text-muted-foreground hover:bg-transparent hover:text-foreground h-9 w-9 rounded-full transition-colors"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>

        {user ? (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="action-item hidden md:flex h-9 rounded-full px-3 text-[13px] font-medium text-muted-foreground hover:bg-transparent hover:text-foreground transition-colors"
            >
              <Link href="/blog/create">
                <PenSquare className="mr-1.5 h-3.5 w-3.5" />
                写文章
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="action-item text-muted-foreground hover:bg-transparent hover:text-foreground h-9 w-9 rounded-full relative transition-colors"
            >
              <Link href="/user/notifications">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-red-500 shadow-sm ring-1 ring-background" />
                )}
                <span className="sr-only">通知</span>
              </Link>
            </Button>
            <div className="action-item flex items-center h-9 ml-0.5">
              <UserDropdown />
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAuthModalOpenChange(true)}
            className="action-item h-9 rounded-full px-4 flex items-center justify-center m-0 text-muted-foreground hover:bg-transparent hover:text-foreground transition-colors group"
          >
            <UserCircle className="mr-2 h-4 w-4 shrink-0 transition-colors group-hover:text-foreground" />
            <span className="text-[13px] font-medium leading-none">登录</span>
          </Button>
        )}
      </div>
      <AuthModal open={authModalOpen} onOpenChange={onAuthModalOpenChange} />
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  )
}
