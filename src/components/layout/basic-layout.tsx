'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SiteLogo } from '@/components/header/site-logo'
import { Menus } from '@/components/header/menus'
import { MobileMenuContent } from '@/components/header/mobile-menu-content'
import { HeaderActions } from '@/components/header/header-actions'
import { useAppDispatch } from '@/store/hooks'
import { clearLoginUser, setLoginUser } from '@/store/modules/user/userSlice'
import { getLoginUser } from '@/api/userController'

interface BasicLayoutProps {
  children: React.ReactNode
  className?: string
}

export function BasicLayout({ children, className }: BasicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const dispatch = useAppDispatch()

  // 在组件挂载时获取当前登录用户信息
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token')

      // 如果有 token，尝试获取当前用户信息
      if (token) {
        try {
          const res = (await getLoginUser()) as unknown as API.BaseResponseLoginUserVO
          if (res.code === 0 && res.data) {
            dispatch(setLoginUser(res.data))
          } else {
            // 如果获取失败，清除登录状态
            dispatch(clearLoginUser())
          }
        } catch (error) {
          // 如果请求失败，清除登录状态
          console.error('获取用户信息失败:', error)
          dispatch(clearLoginUser())
        }
      }
    }
    fetchCurrentUser()
  }, [dispatch])

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
                <MobileMenuContent onClose={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>

            <SiteLogo showText={true} className="hidden sm:flex" />
            <SiteLogo showText={false} className="sm:hidden" />
          </div>

          <div className="hidden flex-1 justify-center md:flex">
            <Menus />
          </div>

          <HeaderActions authModalOpen={authModalOpen} onAuthModalOpenChange={setAuthModalOpen} />
        </div>
      </header>

      <main className={cn('flex-1 p-4 md:p-6 lg:p-8', className)}>
        <div className="container mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
