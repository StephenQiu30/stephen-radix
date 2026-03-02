'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { MonitorPause, Play, RotateCcw, Settings2, StepForward, X } from 'lucide-react'
import { AlgorithmMeta, SortStep } from '@/lib/sorting-algorithms'
import { SortingCanvas } from './sorting-canvas'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AlgorithmVisualizerDialogProps {
  algorithm: AlgorithmMeta | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlgorithmVisualizerDialog({
  algorithm,
  open,
  onOpenChange,
}: AlgorithmVisualizerDialogProps) {
  const [data, setData] = useState<number[]>([])
  const [highlightIndices, setHighlightIndices] = useState<number[]>([])
  const [swapIndices, setSwapIndices] = useState<number[]>([])
  const [completedIndices, setCompletedIndices] = useState<number[]>([])
  const [stepDescription, setStepDescription] = useState<string>('')
  const [isSorting, setIsSorting] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [size, setSize] = useState(10)
  const [customDataInput, setCustomDataInput] = useState('')
  const [isPaused, setIsPaused] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)
  const speedRef = useRef(speed)
  const isPausedRef = useRef(isPaused)
  const stepResolveRef = useRef<((value: void | PromiseLike<void>) => void) | null>(null)

  // Sync refs
  useEffect(() => {
    speedRef.current = speed
  }, [speed])
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Generate random data
  const generateData = useCallback(() => {
    if (isSorting) return
    const newData = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5)
    setData(newData)
    setData(newData)
    setHighlightIndices([])
    setSwapIndices([])
    setCompletedIndices([])
    setStepDescription('')
    setCustomDataInput('') // Reset custom input on random gen
  }, [size, isSorting])

  // Reset when algorithm or visibility changes
  useEffect(() => {
    if (open) {
      generateData()
    } else {
      // Cleanup on close
      handleStop()
    }
  }, [open, generateData])

  const handleCustomDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomDataInput(val)

    // Simple validation: allow numbers, commas, spaces
    const numbers = val
      .split(/[,，\s]+/)
      .map(s => s.trim())
      .filter(s => s !== '' && !isNaN(Number(s)))
      .map(Number)

    if (numbers.length > 0) {
      setData(numbers)
      // We don't update size state to match exactly to avoid regenerating random data immediately
      // But we might want to sync slider if possible, or just let custom data override
      setHighlightIndices([])
      setCompletedIndices([])
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsSorting(false)
    setIsPaused(false)
    if (stepResolveRef.current) {
      stepResolveRef.current()
      stepResolveRef.current = null
    }
  }

  const handlePauseToggle = () => {
    if (!isSorting) return
    const newPaused = !isPaused
    setIsPaused(newPaused)
    // If resuming, resolve any pending step
    if (!newPaused && stepResolveRef.current) {
      stepResolveRef.current()
      stepResolveRef.current = null
    }
  }

  const handleStepForward = () => {
    if (!isSorting || !isPaused || !stepResolveRef.current) return
    stepResolveRef.current()
    stepResolveRef.current = null
  }

  const handleSort = async (startPaused: boolean = false) => {
    if (!algorithm) return

    if (isSorting) {
      handleStop()
      return
    }

    setIsSorting(true)
    setIsPaused(startPaused)
    isPausedRef.current = startPaused
    setCompletedIndices([])
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      await algorithm.func(
        data,
        async (step: SortStep) => {
          if (controller.signal.aborted) return

          setData(step.array)
          setHighlightIndices(step.highlightIndices)
          setSwapIndices(step.swapIndices)
          setStepDescription(step.description)

          setCompletedIndices(prev => {
            return step.completedIndices.length > 0 ? step.completedIndices : prev
          })

          // Pause / Speed control
          if (isPausedRef.current) {
            await new Promise<void>(resolve => {
              stepResolveRef.current = resolve
            })
          } else {
            // Use ref for current speed
            // 1 (slowest) -> 2000ms
            // 100 (fastest) -> 20ms
            const delay = Math.max(20, Math.floor(2000 * Math.pow(0.92, speedRef.current)))
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        },
        controller.signal
      )
    } catch (e) {
      // Ignore abort errors
    } finally {
      if (!controller.signal.aborted) {
        setIsSorting(false)
        setIsPaused(false)
        setHighlightIndices([])
        setSwapIndices([])
        // Optionally mark all as completed if successful finish
        // setCompletedIndices(data.map((_, i) => i))
      }
    }
  }

  const handleReset = () => {
    handleStop()
    generateData()
  }

  if (!algorithm) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl flex h-[90vh] w-[95vw] max-w-6xl flex-col gap-0 overflow-hidden border-border p-0 shadow-2xl transition-all duration-500 sm:rounded-[24px]">
        {/* MacOS Style Header */}
        <div className="flex items-start justify-between border-b border-border/60 bg-transparent px-8 py-6">
          <div className="space-y-1.5">
            <DialogTitle className="text-foreground flex items-center gap-3 text-3xl font-semibold tracking-tight">
              {algorithm.name}
              <span className="text-muted-foreground/60 px-2 text-lg font-normal tracking-normal">
                {algorithm.bestCase}
              </span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/80 selection:bg-primary/10 max-w-2xl text-base leading-relaxed font-normal">
              {algorithm.description}
            </DialogDescription>
          </div>
          {/* Traffic lights inspired visual or just clean space */}
        </div>

        {/* Main Content Area */}
        <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Canvas Area */}
          <div className="bg-secondary/20 relative flex flex-1 flex-col items-center justify-center p-4 sm:p-10">
            {/* Step Description - Moved to prevent overlap */}
            <div className="z-50 mb-6 w-full px-4 text-center">
              <span className="bg-background/80 text-foreground inline-block rounded-full border border-border/50 px-5 py-2 text-sm font-medium shadow-sm backdrop-blur-md transition-all duration-300">
                {stepDescription || '准备就绪'}
              </span>
            </div>

            <div className="aspect-video h-full max-h-[60vh] w-full rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-6 shadow-sm ring-1 ring-border/20 sm:p-8 md:aspect-auto md:max-h-full">
              <SortingCanvas
                data={data}
                highlightIndices={highlightIndices}
                swapIndices={swapIndices}
                completedIndices={completedIndices}
                variant={algorithm.visualizerType}
              />
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="z-10 flex w-full flex-col gap-10 overflow-y-auto border-l border-border/60 bg-background/50 p-8 md:w-80">
            <div className="space-y-6">
              <h3 className="text-muted-foreground/80 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
                <Settings2 className="h-3.5 w-3.5" /> 控制台
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {isSorting ? (
                  <>
                    <Button
                      size="lg"
                      onClick={handlePauseToggle}
                      className={
                        isPaused
                          ? 'rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-sm transition-colors'
                          : 'rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors'
                      }
                    >
                      {isPaused ? (
                        <>
                          <Play className="mr-2 h-4 w-4" /> 继续
                        </>
                      ) : (
                        <>
                          <MonitorPause className="mr-2 h-4 w-4" /> 暂停
                        </>
                      )}
                    </Button>

                    <Button
                      size="lg"
                      onClick={() => {
                        if (!isPaused) handlePauseToggle()
                        else handleStepForward()
                      }}
                      variant="outline"
                      className="rounded-xl border-border/60"
                    >
                      <StepForward className="mr-2 h-4 w-4" /> 单步
                    </Button>

                    <Button
                      size="lg"
                      variant="destructive"
                      onClick={handleStop}
                      className="col-span-2 rounded-xl shadow-sm"
                    >
                      <X className="mr-2 h-4 w-4" /> 停止
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => handleSort(false)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground col-span-2 h-11 rounded-xl text-base shadow-sm transition-all font-medium"
                    >
                      <Play className="mr-2 h-5 w-5" /> 开始演示
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleSort(true)}
                      className="h-11 rounded-xl border-border/60 shadow-sm bg-background/50 hover:bg-accent"
                    >
                      <StepForward className="mr-2 h-4 w-4" /> 单步调试
                    </Button>

                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={handleReset}
                      className="h-11 rounded-xl bg-muted/80 hover:bg-muted text-foreground transition-colors shadow-sm"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> 重置数据
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground font-medium">速度</span>
                  <span className="bg-secondary/60 px-2 py-0.5 rounded-md text-xs font-mono text-foreground text-opacity-80">
                    {speed}%
                  </span>
                </div>
                <Slider
                  value={[speed]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setSpeed(v)}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground font-medium">数量</span>
                  <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono text-foreground text-opacity-80">
                    {size}
                  </span>
                </div>
                <Slider
                  value={[size]}
                  min={10}
                  max={200}
                  step={10}
                  onValueChange={([v]) => setSize(v)}
                  disabled={isSorting}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-muted-foreground text-sm font-medium">自定义数据</Label>
                <Input
                  placeholder="例如: 50, 10, 20..."
                  value={customDataInput}
                  onChange={handleCustomDataChange}
                  disabled={isSorting}
                  className="bg-background/80 border flex h-10 w-full rounded-lg border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            <div className="mt-auto space-y-5 border-t border-white/5 pt-6">
              <h3 className="text-muted-foreground/80 text-xs font-semibold tracking-widest uppercase">
                复杂度分析
              </h3>
              <div className="space-y-3 text-sm font-light">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground font-medium">最优时间</span>
                  <span className="font-mono text-xs text-foreground/80 font-medium">
                    {algorithm.bestCase}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground font-medium">平均时间</span>
                  <span className="font-mono text-xs text-foreground/80 font-medium">
                    {algorithm.averageCase}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground font-medium">最坏时间</span>
                  <span className="font-mono text-xs text-foreground/80 font-medium">
                    {algorithm.worstCase}
                  </span>
                </div>
                <div className="flex justify-between border-t border-dashed border-border py-1 pt-2">
                  <span className="text-muted-foreground font-medium">空间复杂度</span>
                  <span className="font-mono text-xs text-foreground/80 font-medium">{algorithm.spaceComplexity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
