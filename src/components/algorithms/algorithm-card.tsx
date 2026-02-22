'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Activity, ArrowRight, Clock, HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
      className="group h-full"
    >
      <Card className="border-border/40 bg-card/50 hover:border-border/80 dark:hover:border-primary/50 dark:hover:shadow-primary/5 flex h-full flex-col overflow-hidden rounded-[2rem] backdrop-blur-xl transition-all hover:shadow-md">
        <CardHeader className="border-border/40 border-b p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-all group-hover:scale-110">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-foreground group-hover:text-primary text-xl font-bold tracking-tight transition-colors">
                {algorithm.name}
              </CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-full border-0 px-2 py-0.5 text-[10px] font-semibold',
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

        <CardContent className="flex-1 space-y-6 p-6">
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {algorithm.description}
          </p>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 space-y-1.5">
              <div className="text-muted-foreground/60 flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase">
                <Clock className="h-3 w-3" /> 时间复杂度
              </div>
              <div className="text-foreground font-mono text-sm font-bold">
                {algorithm.averageCase}
              </div>
            </div>
            <div className="bg-border/40 h-8 w-px" />
            <div className="flex-1 space-y-1.5 pl-4">
              <div className="text-muted-foreground/60 flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase">
                <HardDrive className="h-3 w-3" /> 空间复杂度
              </div>
              <div className="text-foreground font-mono text-sm font-bold">
                {algorithm.spaceComplexity}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="grid w-full grid-cols-2 gap-3">
            <Button
              variant="ghost"
              className="hover:bg-secondary/80 text-muted-foreground hover:text-foreground w-full rounded-xl"
              asChild
            >
              <Link href={`/algorithms/${algorithm.id}`}>详细介绍</Link>
            </Button>
            <Button
              className="group/btn bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 w-full rounded-xl shadow-lg transition-all hover:scale-105"
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
