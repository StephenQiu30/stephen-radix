'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <Card className="group h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02]">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Activity className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl font-bold tracking-tight">{algorithm.name}</CardTitle>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {algorithm.description}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex flex-col gap-1 p-2 rounded-lg bg-secondary/50">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 平均时间
                            </span>
                            <span className="font-mono font-medium text-foreground">{algorithm.averageCase}</span>
                        </div>
                        <div className="flex flex-col gap-1 p-2 rounded-lg bg-secondary/50">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <HardDrive className="w-3 h-3" /> 空间复杂度
                            </span>
                            <span className="font-mono font-medium text-foreground">{algorithm.spaceComplexity}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant={algorithm.stable ? "default" : "secondary"} className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                            {algorithm.stable ? '稳定' : '不稳定'}
                        </Badge>
                        <Badge variant="outline" className="border-white/10">
                            最优: {algorithm.bestCase}
                        </Badge>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                        onClick={() => onVisualize(algorithm)}
                    >
                        开始演示 <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
