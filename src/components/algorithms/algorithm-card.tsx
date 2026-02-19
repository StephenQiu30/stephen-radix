'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Activity, ArrowRight, Clock, HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full group"
    >
      <Card className="h-full overflow-hidden rounded-[2rem] border-border/40 bg-card/50 backdrop-blur-xl transition-all hover:shadow-md hover:border-border/80 dark:hover:border-primary/50 dark:hover:shadow-primary/5 flex flex-col">
        <CardHeader className="border-b border-border/40 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {algorithm.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold border-0',
                    algorithm.stable
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-amber-500/10 text-amber-500'
                  )}
                >
                  {algorithm.stable ? '稳定' : '不稳定'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 flex-1">
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {algorithm.description}
          </p>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-muted-foreground/60 uppercase">
                <Clock className="h-3 w-3" /> 时间复杂度
              </div>
              <div className="font-mono text-sm font-bold text-foreground">{algorithm.averageCase}</div>
            </div>
            <div className="w-px h-8 bg-border/40" />
            <div className="flex-1 space-y-1.5 pl-4">
              <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-muted-foreground/60 uppercase">
                <HardDrive className="h-3 w-3" /> 空间复杂度
              </div>
              <div className="font-mono text-sm font-bold text-foreground">{algorithm.spaceComplexity}</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="ghost"
              className="w-full rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href={`/algorithms/${algorithm.id}`}>详细介绍</Link>
            </Button>
            <Button
              className="group/btn w-full rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90"
              onClick={() => onVisualize(algorithm)}
            >
              演示
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
