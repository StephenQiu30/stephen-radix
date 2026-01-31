'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Activity, Zap, HardDrive, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlgorithmMeta } from '@/lib/sorting-algorithms'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
            <div className="group relative h-full overflow-hidden rounded-[32px] border-none bg-secondary/30 p-6 shadow-none backdrop-blur-sm transition-all duration-300 hover:bg-secondary/50">
                <div className="flex h-full flex-col justify-between space-y-6">
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <Activity className="h-6 w-6" />
                            </div>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm",
                                    algorithm.stable
                                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                                        : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                                )}
                            >
                                {algorithm.stable ? '稳定' : '不稳定'}
                            </Badge>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">{algorithm.name}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground dark:text-zinc-400 line-clamp-2">
                            {algorithm.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4 border-t border-border/10 pt-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    <Clock className="h-3 w-3" /> 时间复杂度
                                </div>
                                <div className="font-mono text-sm font-semibold">{algorithm.averageCase}</div>
                            </div>
                            <div className="space-y-1 border-l border-border/10 pl-4">
                                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    <HardDrive className="h-3 w-3" /> 空间复杂度
                                </div>
                                <div className="font-mono text-sm font-semibold">{algorithm.spaceComplexity}</div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                className="w-full rounded-2xl bg-background/50 hover:bg-background/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                variant="secondary"
                                asChild
                            >
                                <Link href={`/algorithms/${algorithm.id}`}>
                                    详细介绍
                                </Link>
                            </Button>
                            <Button
                                className="w-full rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
