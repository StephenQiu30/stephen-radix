'use client'

import * as React from 'react'
import Link from 'next/link'
import { Github, Menu, Search, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Menus } from '@/components/layout/menus'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { AuthModal } from '@/components/auth/auth-modal'
import { UserDropdown } from '@/components/auth/user-dropdown'

interface BasicLayoutProps {
  children: React.ReactNode
  className?: string
}

export function BasicLayout({ children, className }: BasicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)
  const { user } = useAppSelector((state: RootState) => state.user)

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
                <div className="flex flex-col gap-4 pt-2">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 border-b pb-4"
                  >
                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                      <span className="text-primary-foreground text-lg font-bold">S</span>
                    </div>
                    <span className="text-lg font-bold">Stephen Radix</span>
                  </Link>
                  <nav className="flex flex-col gap-1">
                    <Menus vertical />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-primary-foreground text-lg font-bold">S</span>
              </div>
              <span className="hidden text-lg font-bold sm:inline-block">Stephen Radix</span>
            </Link>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden flex-1 justify-center md:flex">
            <Menus />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:text-primary">
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
              <UserDropdown />
            ) : (
              <Button size="default" onClick={() => setAuthModalOpen(true)} className="gap-2">
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">登录</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn('flex-1 p-4 md:p-6 lg:p-8', className)}>
        <div className="container mx-auto max-w-7xl">{children}</div>
      </main>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}
