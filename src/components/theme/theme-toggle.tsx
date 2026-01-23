"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="relative h-9 w-9 rounded-md inline-flex items-center justify-center transition-colors hover:bg-accent">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative h-9 w-9 rounded-md inline-flex items-center justify-center overflow-hidden",
        "transition-all duration-300",
        "hover:bg-accent"
      )}
      aria-label="Toggle theme"
    >
      <Sun
        className={cn(
          "h-[1.2rem] w-[1.2rem] transition-all duration-300 absolute",
          isDark
            ? "translate-y-10 opacity-0 rotate-90 scale-0"
            : "translate-y-0 opacity-100 rotate-0 scale-100"
        )}
      />
      <Moon
        className={cn(
          "h-[1.2rem] w-[1.2rem] transition-all duration-300 absolute",
          !isDark
            ? "-translate-y-10 opacity-0 rotate-90 scale-0"
            : "translate-y-0 opacity-100 rotate-0 scale-100"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}


