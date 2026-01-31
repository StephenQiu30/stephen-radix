'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { BookOpen, Home, Activity } from 'lucide-react'
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
  { title: '阅读博客', href: '/blog', icon: <BookOpen className="h-4 w-4" /> },
  { title: '算法可视化', href: '/algorithms', icon: <Activity className="h-4 w-4" /> },
]

export function Menus({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <nav
      className={cn(
        'relative flex items-center rounded-full border border-black/5 bg-black/5 p-1 backdrop-blur-md dark:border-white/5 dark:bg-white/10',
        vertical ? 'w-full flex-col rounded-xl' : 'flex-row',
        className
      )}
    >
      {menuItems.map(item => {
        const active = isActive(item.href || '')
        return (
          <Link
            key={item.href}
            href={item.href || '#'}
            className={cn(
              'relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 outline-none',
              vertical ? 'w-full justify-start rounded-lg' : '',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
            )}
          >
            {active && (
              <motion.div
                layoutId="active-menu-pill"
                className={cn(
                  'bg-background absolute inset-0 z-[-1] border border-black/5 shadow-sm dark:border-white/5',
                  vertical ? 'rounded-lg' : 'rounded-full'
                )}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span
              className={cn(
                'relative z-10',
                active && 'scale-105 transition-transform duration-200'
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
