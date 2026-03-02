'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { AlgorithmCard } from '@/components/algorithms/algorithm-card'
import { AlgorithmVisualizerDialog } from '@/components/algorithms/algorithm-visualizer-dialog'
import { AlgorithmMeta, ALGORITHMS } from '@/lib/sorting-algorithms'

export default function AlgorithmsPage() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmMeta | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleVisualize = (algo: AlgorithmMeta) => {
    setSelectedAlgo(algo)
    setIsDialogOpen(true)
  }

  return (
    <div className="bg-background min-h-screen pb-20 font-sans">
      <main className="container mx-auto max-w-7xl px-6 py-12">
        {/* Hero */}
        <div className="mx-auto mb-24 max-w-4xl space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium"
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="text-primary/90">交互式学习</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            排序算法
            <span className="block mt-2 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              可视化演示
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed md:text-xl"
          >
            通过精美的交互式动画，深入探索 8 种经典排序算法的运行机制。
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
