'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, UserCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearLoginUser } from '@/store/modules'
import { userLogout } from '@/api/userController'
import { cn } from '@/lib/utils'

export function UserDropdown() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  const [open, setOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await userLogout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      dispatch(clearLoginUser())
      setOpen(false)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-primary relative">
          {user?.userAvatar ? (
            <img
              src={user.userAvatar}
              alt={user.userName || '用户头像'}
              className="h-5 w-5 rounded-full object-cover"
            />
          ) : (
            <UserCircle className="h-5 w-5" />
          )}
          <span className="sr-only">用户菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-3 px-2 py-3">
          {user?.userAvatar ? (
            <img
              src={user.userAvatar}
              alt={user.userName || '用户头像'}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <UserCircle className="text-muted-foreground h-6 w-6" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">{user?.userName || '未知用户'}</span>
            <span className="text-muted-foreground text-xs">
              {user?.userRole === 'admin' ? '管理员' : '普通用户'}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          个人信息
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          账号设置
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
