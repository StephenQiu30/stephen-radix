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
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
                <div className="container flex h-16 items-center px-6 mx-auto max-w-7xl">
                    <Button variant="ghost" size="sm" asChild className="mr-8 rounded-full">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2 font-semibold">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>Algorithm Visualizer</span>
                    </div>
                </div>
            </header>

            <main className="container px-6 py-12 mx-auto max-w-7xl">
                {/* Hero */}
                <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight lg:text-6xl"
                    >
                        Sort Algorithms <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                            Visualized
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground"
                    >
                        Explore the mechanics of 8 classic sorting algorithms through interactive visualizations.
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
