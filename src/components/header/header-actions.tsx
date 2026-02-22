import * as React from 'react'
import Link from 'next/link'
import { Bell, Github, Search, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { AuthModal } from '@/components/auth/auth-modal'
import { UserDropdown } from '@/components/auth/user-dropdown'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { CommandMenu } from '@/components/search/command-menu'

interface HeaderActionsProps {
  onAuthModalOpenChange: (open: boolean) => void
  authModalOpen: boolean
}

export function HeaderActions({ onAuthModalOpenChange, authModalOpen }: HeaderActionsProps) {
  const { user } = useAppSelector((state: RootState) => state.user)
  const [open, setOpen] = React.useState(false)

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
              <Button variant="ghost" size="icon" className="hover:text-primary relative">
                <Bell className="h-5 w-5" />
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
