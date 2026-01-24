'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings, FileText, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MenuItem {
  title: string
  href?: string
  icon?: React.ReactNode
  children?: MenuItem[]
  badge?: string
}

const menuItems: MenuItem[] = [
  { title: '首页', href: '/', icon: <Home className="h-4 w-4" /> },
  { title: '用户管理', href: '/users', icon: <Users className="h-4 w-4" /> },
  { title: '文章管理', href: '/articles', icon: <FileText className="h-4 w-4" /> },
  { title: '数据统计', href: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { title: '系统设置', href: '/settings', icon: <Settings className="h-4 w-4" /> },
]

export function Menus({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <nav
      className={cn(
        'flex items-center gap-1',
        vertical && 'w-full flex-col items-stretch gap-1',
        className
      )}
    >
      {menuItems.map(item => (
        <Link
          key={item.href}
          href={item.href || '#'}
          className={cn(
            'group text-muted-foreground relative inline-flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200',
            'hover:text-foreground hover:bg-accent/50',
            'before:bg-primary before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-0 before:transition-all before:duration-300',
            'hover:before:w-full',
            isActive(item.href || '') && 'text-foreground bg-accent/50 before:w-full',
            vertical &&
              'w-full px-4 py-3 before:top-0 before:bottom-auto before:left-0 before:h-full before:w-0.5 hover:before:h-full'
          )}
        >
          <span className={cn('transition-transform duration-200', 'group-hover:scale-110')}>
            {item.icon}
          </span>
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
