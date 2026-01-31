'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  HardDrive,
  Play,
  CheckCircle,
  XCircle,
  BookOpen,
  Share2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ALGORITHMS } from '@/lib/sorting-algorithms'
import { Badge } from '@/components/ui/badge'
import { AlgorithmVisualizerDialog } from '@/components/algorithms/algorithm-visualizer-dialog'

export default function AlgorithmDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const algorithm = ALGORITHMS.find(a => a.id === slug)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  if (!algorithm) {
    notFound()
  }

  return (
    <div className="bg-background selection:bg-primary/20 min-h-screen pb-32 font-sans">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white/5">
            <Link href="/algorithms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-muted-foreground mr-2 hidden sm:inline-block">
                Sorting Visualizer
              </span>
              <span className="text-white/20">/</span>
              <span className="text-foreground font-semibold">{algorithm.name}</span>
            </div>
          </div>
          <div className="flex w-[100px] justify-end">{/* Placeholder for future actions */}</div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col items-center justify-center">
          {/* Main Content */}
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 text-center sm:text-left"
              >
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {algorithm.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-secondary/50 rounded-full border-white/5 px-4 py-1.5 text-sm font-normal backdrop-blur-md transition-colors hover:bg-white/10"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-4">
                  <h1 className="bg-gradient-to-b from-white to-white/70 bg-clip-text pb-2 text-6xl font-semibold tracking-tight text-transparent md:text-7xl lg:text-8xl">
                    {algorithm.name}
                  </h1>
                  <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-light sm:mx-0 md:text-2xl">
                    {algorithm.description}
                  </p>
                </div>

                {/* Simplified Characteristics */}
                <div className="grid grid-cols-2 gap-4 pt-4 sm:flex sm:gap-8">
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm uppercase tracking-wider sm:justify-start">
                      <Clock className="h-4 w-4" /> Avg Time
                    </div>
                    <div className="text-2xl font-medium tracking-tight text-foreground">{algorithm.averageCase}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm uppercase tracking-wider sm:justify-start">
                      <HardDrive className="h-4 w-4" /> Space
                    </div>
                    <div className="text-2xl font-medium tracking-tight text-foreground">{algorithm.spaceComplexity}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm uppercase tracking-wider sm:justify-start">
                      {algorithm.stable ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} Stability
                    </div>
                    <div className="text-2xl font-medium tracking-tight text-foreground">{algorithm.stable ? 'Stable' : 'Unstable'}</div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-8 sm:justify-start">
                  <Button
                    size="lg"
                    className="shadow-primary/20 h-14 rounded-full px-10 text-lg font-medium shadow-xl transition-transform hover:scale-105"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Play className="mr-2 h-5 w-5 fill-current" /> Start Demo
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

        </div>



      </main >

      <AlgorithmVisualizerDialog
        algorithm={algorithm}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div >
  )
}
