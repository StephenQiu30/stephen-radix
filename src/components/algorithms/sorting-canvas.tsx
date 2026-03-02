'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type CanvasVariant = 'bar' | 'scatter' | 'pyramid' | 'dots' | 'rainbow'

interface SortingCanvasProps {
  data: number[]
  highlightIndices: number[]
  swapIndices?: number[]
  completedIndices: number[]
  className?: string
  barColor?: string
  highlightColor?: string
  swapColor?: string
  completedColor?: string
  variant?: CanvasVariant
}

export function SortingCanvas({
  data,
  highlightIndices,
  swapIndices = [],
  completedIndices,
  className,
  barColor = 'bg-primary/90', // Modified default color
  highlightColor = 'bg-yellow-400', // Bright Yellow for comparison
  swapColor = 'bg-orange-500', // Apple-ish Orange
  completedColor = 'bg-green-500', // Apple-ish Green
  variant = 'bar',
}: SortingCanvasProps) {
  // Common physics for Apple-like spring animations
  const springConfig = { type: 'spring' as const, stiffness: 280, damping: 22, mass: 0.8 }

  return (
    <div className={cn('relative h-full w-full', className)}>
      <div
        className={cn(
          'flex h-full w-full justify-center px-1',
          // For Scatter, we need relative positioning context inside
          variant === 'scatter' ? 'relative' : '',
          // For Pyramid, centering is key. Bars usually align bottom too.
          variant === 'pyramid' ? 'items-end gap-[1px]' : '',
          // Dots align bottom usually to show 'height' implicitly, or center if it's just a line of dots.
          // Let's assume height representation needs bottom alignment.
          variant === 'dots' ? 'items-end gap-1' : '',
          // Default bar alignment
          variant === 'bar' || variant === 'rainbow' ? 'items-end gap-[1px] sm:gap-1' : ''
        )}
      >
        <AnimatePresence mode="popLayout">
          {data.map((value, idx) => {
            const isHighlighted =
              highlightIndices.includes(idx) || (swapIndices && swapIndices.includes(idx))

            if (variant === 'dots') {
              return (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{ height: `${value}%` }}
                  className="flex w-full items-start justify-center transition-none"
                >
                  <motion.div
                    className={cn(
                      'h-3 w-3 rounded-full shadow-sm md:h-4 md:w-4',
                      isHighlighted && 'z-20 scale-150 shadow-lg ring-2 ring-white/50'
                    )}
                    animate={{
                      backgroundColor:
                        highlightIndices.includes(idx)
                          ? '#f59e0b' // amber-500
                          : swapIndices && swapIndices.includes(idx)
                            ? 'hsl(var(--destructive))'
                            : completedIndices.includes(idx)
                              ? '#10b981' // emerald-500
                              : 'hsl(var(--primary))',
                    }}
                    transition={springConfig}
                  />
                </motion.div>
              )
            }

            if (variant === 'scatter') {
              const leftPos = (idx / data.length) * 100
              const widthPct = Math.max(0.5, (100 / data.length) * 0.8)

              return (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{
                    bottom: `${value}%`,
                    left: `${leftPos}%`,
                  }}
                  className="absolute -translate-x-1/2 transform"
                  style={{ width: `${widthPct}%` }}
                  transition={{ type: 'tween', duration: 0.15 }}
                >
                  <motion.div
                    className={cn(
                      'aspect-square w-full rounded-full shadow-sm transition-none',
                      isHighlighted && 'z-10 scale-150 ring-2 ring-white/20'
                    )}
                    animate={{
                      backgroundColor:
                        highlightIndices.includes(idx)
                          ? '#f59e0b' // amber-500
                          : swapIndices && swapIndices.includes(idx)
                            ? 'hsl(var(--destructive))'
                            : completedIndices.includes(idx)
                              ? '#10b981' // emerald-500
                              : 'hsl(var(--primary))',
                    }}
                    transition={springConfig}
                  />
                </motion.div>
              )
            }

            if (variant === 'pyramid') {
              return (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{
                    height: `${value}%`,
                    backgroundColor:
                      highlightIndices.includes(idx)
                        ? '#f59e0b' // amber-500
                        : swapIndices && swapIndices.includes(idx)
                          ? 'hsl(var(--destructive))'
                          : completedIndices.includes(idx)
                            ? '#10b981' // emerald-500
                            : 'hsl(var(--primary))',
                  }}
                  className={cn(
                    'w-full rounded-t-sm transition-none',
                    isHighlighted && 'shadow-[0_0_10px_rgba(255,255,255,0.3)] brightness-110'
                  )}
                  transition={springConfig}
                />
              )
            }

            // Default & Rainbow (Bars)
            return (
              <motion.div
                key={idx}
                initial={false}
                animate={{
                  height: `${value}%`,
                  backgroundColor:
                    highlightIndices.includes(idx)
                      ? '#f59e0b' // amber-500
                      : swapIndices && swapIndices.includes(idx)
                        ? 'hsl(var(--destructive))'
                        : completedIndices.includes(idx)
                          ? '#10b981' // emerald-500
                          : variant === 'rainbow'
                            ? `hsl(${Math.round((value / 100) * 360)}, 85%, 65%)` // Rainbow
                            : 'hsl(var(--primary))', // Theme primary
                }}
                className={cn(
                  'group relative flex w-full flex-col items-center justify-end rounded-t-md transition-none sm:rounded-t-lg',
                  // colorClass, // We handle color in animate for better perf
                  isHighlighted &&
                  'z-50 scale-[1.03] shadow-[0_4px_16px_rgba(0,0,0,0.15)] ring-2 ring-white/30 brightness-110'
                )}
                // style={rainbowStyle} // Handled in animate
                transition={springConfig}
              >
                {data.length <= 40 && (
                  <span
                    className={cn(
                      'text-foreground pointer-events-none absolute -top-6 left-1/2 z-20 -translate-x-1/2 text-[10px] font-bold transition-all duration-200'
                    )}
                  >
                    {value}
                  </span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Axis line */}
      <div className="absolute right-0 bottom-0 left-0 h-[1px] bg-white/5" />
    </div>
  )
}
