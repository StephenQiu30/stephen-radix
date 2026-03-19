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
      <button className="text-muted-foreground hover:bg-transparent hover:text-foreground relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors">
        <Sun className="h-4 w-4" />
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
        'flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground transition-colors relative overflow-hidden'
      )}
      aria-label="Toggle theme"
    >
      <Sun
        className={cn(
          'absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 transition-all duration-300',
          isDark
            ? 'translate-y-10 scale-0 rotate-90 opacity-0'
            : '-translate-y-1/2 scale-100 rotate-0 opacity-100'
        )}
      />
      <Moon
        className={cn(
          'absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 transition-all duration-300',
          !isDark
            ? '-translate-y-10 scale-0 rotate-90 opacity-0'
            : '-translate-y-1/2 scale-100 rotate-0 opacity-100'
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
