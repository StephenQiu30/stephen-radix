'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Activity, BookOpen, Home, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MenuItem {
  title: string
  href?: string
  icon?: React.ReactNode
  children?: MenuItem[]
  badge?: string
  activePrefix?: string
}

const menuItems: MenuItem[] = [
  { title: '首页', href: '/', icon: <Home className="h-4 w-4" /> },
  {
    title: '阅读博客',
    href: '/blog',
    activePrefix: '/blog',
    icon: <BookOpen className="h-4 w-4" />,
  },
  { title: '算法可视化', href: '/algorithms', icon: <Activity className="h-4 w-4" /> },
  {
    title: '我的空间',
    href: '/user/profile',
    activePrefix: '/user',
    icon: <User className="h-4 w-4" />,
  },
]

export function Menus({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  const pathname = usePathname()

  const isActive = (item: MenuItem) => {
    if (item.href === '/') {
      return pathname === '/'
    }
    if (item.activePrefix) {
      return pathname.startsWith(item.activePrefix)
    }
    return item.href ? pathname.startsWith(item.href) : false
  }

  return (
    <nav
      className={cn(
        'relative flex items-center p-1',
        vertical
          ? 'w-full flex-col gap-1 bg-transparent p-0'
          : 'rounded-full border border-black/5 bg-black/5 backdrop-blur-md dark:border-white/5 dark:bg-white/10',
        className
      )}
    >
      {menuItems.map(item => {
        const active = isActive(item)
        return (
          <Link
            key={item.href}
            href={item.href || '#'}
            className={cn(
              'relative z-10 flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors duration-200 outline-none',
              vertical
                ? 'w-full justify-start rounded-xl py-3.5 text-base'
                : 'justify-center rounded-full',
              active
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5',
              vertical && active && 'bg-black/5 dark:bg-white/10' // Mobile active background
            )}
          >
            {!vertical && active && (
              <motion.div
                layoutId="active-menu-pill"
                className="bg-background absolute inset-0 z-[-1] rounded-full border border-black/5 shadow-sm dark:border-white/5"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span
              className={cn(
                'relative z-10',
                active && !vertical && 'scale-105 transition-transform duration-200'
              )}
            >
              {item.icon}
            </span>
            <span className="relative z-10">{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
