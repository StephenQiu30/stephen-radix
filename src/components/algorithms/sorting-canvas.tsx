'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
}

export function SortingCanvas({
    data,
    highlightIndices,
    swapIndices = [],
    completedIndices,
    className,
    barColor = 'bg-primary/80',
    highlightColor = 'bg-purple-500',
    swapColor = 'bg-orange-500',
    completedColor = 'bg-green-500',
}: SortingCanvasProps) {
    // Normalize data to 0-100 range if needed, or assume it's already percentage-friendly
    // For this impl, assume data contains values 0-100 representing height percentage.

    return (
        <div className={cn("flex items-end justify-center w-full h-full gap-[1px] sm:gap-1", className)}>
            <AnimatePresence mode="popLayout">
                {data.map((value, idx) => {
                    let bgColor = barColor
                    if (highlightIndices.includes(idx)) bgColor = highlightColor
                    if (swapIndices && swapIndices.includes(idx)) bgColor = swapColor
                    if (completedIndices.includes(idx)) bgColor = completedColor

                    return (
                        <motion.div
                            key={`${idx}-${value}`}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                                opacity: 1,
                                height: `${value}%`,
                                backgroundColor: undefined
                            }}
                            className={cn(
                                "w-full rounded-t-[1px] sm:rounded-t-md transition-colors duration-100 flex flex-col justify-end items-center relative group",
                                bgColor
                            )}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        >
                            {/* Number label - Show on hover or if small dataset */}
                            {data.length <= 40 && (
                                <span className={cn(
                                    "absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold transition-all duration-200 pointer-events-none",
                                    "text-foreground/80"
                                )}>
                                    {value}
                                </span>
                            )}
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}
