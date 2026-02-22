'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, BookOpen, Home, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

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

  if (vertical) {
    return (
      <nav className={cn('flex flex-col gap-1', className)}>
        {menuItems.map(item => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href || '#'}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors duration-200',
                active
                  ? 'bg-accent/50 text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <span className={cn('relative z-10', active && 'text-primary')}>{item.icon}</span>
              <span className="relative z-10">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="bg-background/50 dark:bg-accent/10 rounded-full border px-2 py-1 backdrop-blur-md">
        {menuItems.map(item => {
          const active = isActive(item)
          return (
            <NavigationMenuItem key={item.title}>
              <Link href={item.href || '#'} legacyBehavior passHref>
                <NavigationMenuLink
                  active={active}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'hover:bg-accent/50 focus:bg-accent/50 data-[active]:bg-accent data-[active]:text-accent-foreground rounded-full bg-transparent px-4 py-2',
                    active && 'bg-accent text-accent-foreground'
                  )}
                >
                  <span className="mr-2 h-4 w-4">{item.icon}</span>
                  {item.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
