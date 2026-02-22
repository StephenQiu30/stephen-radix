'use client'

import React, { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AlgorithmVisualizerDialog } from '@/components/algorithms/algorithm-visualizer-dialog'
import { ALGORITHMS } from '@/lib/sorting-algorithms'

export function AlgorithmVisualizerWrapper({ algorithmId }: { algorithmId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const algorithm = ALGORITHMS.find(a => a.id === algorithmId)

  if (!algorithm) return null

  return (
    <>
      <Button size="sm" className="rounded-full shadow-lg" onClick={() => setIsDialogOpen(true)}>
        <Play className="mr-2 h-4 w-4 fill-current" /> 演示
      </Button>

      <AlgorithmVisualizerDialog
        algorithm={algorithm}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
