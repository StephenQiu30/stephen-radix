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
    <div className="bg-background selection:bg-primary/20 min-h-screen pb-20 font-sans">
      <main className="container mx-auto max-w-7xl px-6 py-12">
        {/* Hero */}
        <div className="mx-auto mb-24 max-w-4xl space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full border border-black/5 bg-black/5 px-4 py-1.5 text-sm font-medium backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            交互式学习
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground text-6xl font-semibold tracking-tighter md:text-7xl lg:text-8xl"
          >
            排序算法 <br />
            <span className="from-primary to-primary/60 bg-gradient-to-b bg-clip-text text-transparent">
              可视化演示
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-light md:text-2xl"
          >
            通过精美的交互式动画，深入探索8种经典排序算法的运行机制。
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
