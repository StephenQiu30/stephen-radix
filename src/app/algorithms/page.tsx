'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlgorithmCard } from '@/components/algorithms/algorithm-card'
import { AlgorithmVisualizerDialog } from '@/components/algorithms/algorithm-visualizer-dialog'
import { ALGORITHMS, AlgorithmMeta } from '@/lib/sorting-algorithms'

export default function AlgorithmsPage() {
    const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmMeta | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleVisualize = (algo: AlgorithmMeta) => {
        setSelectedAlgo(algo)
        setIsDialogOpen(true)
    }

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 pb-20">


            <main className="container px-6 py-12 mx-auto max-w-7xl">
                {/* Hero */}
                <div className="mb-24 text-center max-w-4xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur-xl"
                    >
                        <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                        交互式学习
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-foreground"
                    >
                        排序算法 <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/60">
                            可视化演示
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        通过精美的交互式动画，深入探索8种经典排序算法的运行机制。
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ALGORITHMS.map((algo, idx) => (
                        <AlgorithmCard
                            key={algo.id}
                            algorithm={algo}
                            index={idx}
                            onVisualize={handleVisualize}
                        />
                    ))}
                </div>
            </main>

            <AlgorithmVisualizerDialog
                algorithm={selectedAlgo}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    )
}
