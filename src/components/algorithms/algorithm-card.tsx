'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Activity, ArrowRight, Clock, HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlgorithmMeta } from '@/lib/sorting-algorithms'
import { cn } from '@/lib/utils'

interface AlgorithmCardProps {
  algorithm: AlgorithmMeta
  onVisualize: (algo: AlgorithmMeta) => void
  index?: number
}

export function AlgorithmCard({ algorithm, onVisualize, index = 0 }: AlgorithmCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <div className="group bg-secondary/30 hover:bg-secondary/50 relative h-full overflow-hidden rounded-[32px] border-none p-6 shadow-none backdrop-blur-sm transition-all duration-300">
        <div className="flex h-full flex-col justify-between space-y-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full transition-colors">
                <Activity className="h-6 w-6" />
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md',
                  algorithm.stable
                    ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400'
                    : 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400'
                )}
              >
                {algorithm.stable ? '稳定' : '不稳定'}
              </Badge>
            </div>
            <h3 className="text-foreground mb-2 text-2xl font-bold tracking-tight">
              {algorithm.name}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed dark:text-zinc-400">
              {algorithm.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-border/10 flex gap-4 border-t pt-4">
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase">
                  <Clock className="h-3 w-3" /> 时间复杂度
                </div>
                <div className="font-mono text-sm font-semibold">{algorithm.averageCase}</div>
              </div>
              <div className="border-border/10 space-y-1 border-l pl-4">
                <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase">
                  <HardDrive className="h-3 w-3" /> 空间复杂度
                </div>
                <div className="font-mono text-sm font-semibold">{algorithm.spaceComplexity}</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                className="bg-background/50 hover:bg-background/80 w-full rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                variant="secondary"
                asChild
              >
                <Link href={`/algorithms/${algorithm.id}`}>详细介绍</Link>
              </Button>
              <Button
                className="shadow-primary/20 w-full rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => onVisualize(algorithm)}
              >
                演示
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
