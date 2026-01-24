'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="hover:bg-accent hover:text-primary relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md',
        'transition-all duration-300',
        'hover:bg-accent'
      )}
      aria-label="Toggle theme"
    >
      <Sun
        className={cn(
          'absolute h-[1.2rem] w-[1.2rem] transition-all duration-300',
          isDark
            ? 'translate-y-10 scale-0 rotate-90 opacity-0'
            : 'translate-y-0 scale-100 rotate-0 opacity-100'
        )}
      />
      <Moon
        className={cn(
          'absolute h-[1.2rem] w-[1.2rem] transition-all duration-300',
          !isDark
            ? '-translate-y-10 scale-0 rotate-90 opacity-0'
            : 'translate-y-0 scale-100 rotate-0 opacity-100'
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
