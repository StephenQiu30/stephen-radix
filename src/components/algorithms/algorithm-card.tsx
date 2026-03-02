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
      <Card className="border-black/5 dark:border-white/5 bg-background hover:-translate-y-1 hover:shadow-xl dark:bg-[#0a0a0a] flex h-full flex-col overflow-hidden rounded-[24px] shadow-sm transition-all duration-500">
        <CardHeader className="p-6 pb-2">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-foreground group-hover:text-primary text-xl font-bold tracking-tight transition-colors">
                {algorithm.name}
              </CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border-none',
                    algorithm.stable
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  )}
                >
                  {algorithm.stable ? '稳定' : '不稳定'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-6 p-6 pt-4">
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {algorithm.description}
          </p>

          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="bg-secondary/40 flex flex-col justify-center rounded-2xl space-y-1 p-3">
              <div className="text-muted-foreground/70 flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase">
                <Clock className="h-3 w-3" /> 时间复杂度
              </div>
              <div className="text-foreground font-mono text-sm font-bold">
                {algorithm.averageCase}
              </div>
            </div>
            <div className="bg-secondary/40 flex flex-col justify-center rounded-2xl space-y-1 p-3">
              <div className="text-muted-foreground/70 flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase">
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
              variant="secondary"
              className="hover:bg-secondary/80 text-foreground w-full rounded-[16px] shadow-sm font-medium h-11"
              asChild
            >
              <Link href={`/algorithms/${algorithm.id}`}>详细介绍</Link>
            </Button>
            <Button
              className="group/btn bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-[16px] shadow-sm transition-all duration-300 active:scale-95 font-medium h-11"
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
