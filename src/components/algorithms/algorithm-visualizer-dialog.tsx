'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
    Play,
    Pause,
    RotateCcw,
    Maximize2,
    X,
    Settings2,
    StepForward,
    MonitorPause,
} from 'lucide-react'
import { AlgorithmMeta, SortStep } from '@/lib/sorting-algorithms'
import { SortingCanvas } from './sorting-canvas'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

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
    useEffect(() => { speedRef.current = speed }, [speed])
    useEffect(() => { isPausedRef.current = isPaused }, [isPaused])

    // Generate random data
    const generateData = useCallback(() => {
        if (isSorting) return
        const newData = Array.from({ length: size }, () =>
            Math.floor(Math.random() * 100) + 5
        )
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
        const numbers = val.split(/[,，\s]+/)
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

    const handleSort = async () => {
        if (!algorithm) return

        if (isSorting) {
            handleStop()
            return
        }

        setIsSorting(true)
        setIsPaused(false)
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
                        await new Promise<void>((resolve) => {
                            stepResolveRef.current = resolve
                        })
                    } else {
                        // Use ref for current speed
                        // 1 (slowest) -> 2000ms
                        // 100 (fastest) -> 20ms
                        const delay = Math.max(20, Math.floor(2000 * Math.pow(0.92, speedRef.current)))
                        await new Promise((resolve) => setTimeout(resolve, delay))
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
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/80 backdrop-blur-2xl border-white/10 sm:rounded-[32px] shadow-2xl">
                {/* MacOS Style Header */}
                <div className="flex items-start justify-between px-8 py-6 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-xl">
                    <div className="space-y-1.5">
                        <DialogTitle className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
                            {algorithm.name}
                            <span className="text-lg font-normal text-muted-foreground/60 tracking-normal px-2">
                                {algorithm.bestCase}
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground/80 font-normal leading-relaxed max-w-2xl selection:bg-primary/10">
                            {algorithm.description}
                        </DialogDescription>
                    </div>
                    {/* Traffic lights inspired visual or just clean space */}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* Canvas Area */}
                    <div className="flex-1 relative bg-secondary/5 p-4 sm:p-10 flex flex-col items-center justify-center">
                        {/* Step Description - Moved to prevent overlap */}
                        <div className="w-full text-center px-4 z-50 mb-6">
                            <span className="inline-block px-6 py-2.5 rounded-full bg-background/60 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg text-sm font-medium text-foreground/90 transition-all duration-300">
                                {stepDescription || '准备就绪'}
                            </span>
                        </div>

                        <div className="w-full h-full max-h-[60vh] md:max-h-full aspect-video md:aspect-auto rounded-3xl border border-black/5 dark:border-white/5 bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 dark:to-white/0 backdrop-blur-sm p-6 sm:p-8 shadow-inner ring-1 ring-black/5 dark:ring-white/5">
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
                    <div className="w-full md:w-80 border-l border-white/5 bg-background/40 backdrop-blur-xl p-8 flex flex-col gap-10 z-10 overflow-y-auto">

                        <div className="space-y-6">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                <Settings2 className="w-3.5 h-3.5" /> 控制台
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                {isSorting ? (
                                    <>
                                        <Button
                                            size="lg"
                                            onClick={handlePauseToggle}
                                            className={isPaused ?
                                                "bg-green-500 hover:bg-green-600 rounded-2xl shadow-lg shadow-green-500/20" :
                                                "bg-amber-500 hover:bg-amber-600 rounded-2xl shadow-lg shadow-amber-500/20"
                                            }
                                        >
                                            {isPaused ? (
                                                <><Play className="mr-2 h-4 w-4" /> 继续</>
                                            ) : (
                                                <><MonitorPause className="mr-2 h-4 w-4" /> 暂停</>
                                            )}
                                        </Button>

                                        {isPaused ? (
                                            <Button size="lg" onClick={handleStepForward} variant="outline" className="rounded-2xl border-white/10">
                                                <StepForward className="mr-2 h-4 w-4" /> 单步
                                            </Button>
                                        ) : (
                                            <Button size="lg" variant="destructive" onClick={handleStop} className="rounded-2xl shadow-lg shadow-red-500/20">
                                                <X className="mr-2 h-4 w-4" /> 停止
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <Button
                                        size="lg"
                                        onClick={handleSort}
                                        className="bg-primary hover:bg-primary/90 col-span-2 rounded-2xl shadow-lg shadow-primary/25 h-12 text-base"
                                    >
                                        <Play className="mr-2 h-5 w-5" /> 开始演示
                                    </Button>
                                )}

                                {!isSorting && (
                                    <Button size="lg" variant="secondary" onClick={handleReset} className="col-span-2 rounded-2xl bg-secondary/50 hover:bg-secondary/70 h-12">
                                        <RotateCcw className="mr-2 h-4 w-4" /> 重置数据
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm items-baseline">
                                    <span className="text-muted-foreground font-medium">速度</span>
                                    <span className="font-mono text-xs bg-secondary/50 px-2 py-0.5 rounded-md">{speed}%</span>
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
                                <div className="flex justify-between text-sm items-baseline">
                                    <span className="text-muted-foreground font-medium">数量</span>
                                    <span className="font-mono text-xs bg-secondary/50 px-2 py-0.5 rounded-md">{size}</span>
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
                                <Label className="text-sm text-muted-foreground font-medium">自定义数据</Label>
                                <Input
                                    placeholder="例如: 50, 10, 20..."
                                    value={customDataInput}
                                    onChange={handleCustomDataChange}
                                    disabled={isSorting}
                                    className="bg-secondary/30 border-white/5 rounded-xl focus:ring-1 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-5 pt-6 border-t border-white/5 mt-auto">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">复杂度分析</h3>
                            <div className="space-y-3 text-sm font-light">
                                <div className="flex justify-between py-1">
                                    <span className="text-muted-foreground">最优时间</span>
                                    <span className="font-mono bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-xs">{algorithm.bestCase}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-muted-foreground">平均时间</span>
                                    <span className="font-mono bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-xs">{algorithm.averageCase}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-muted-foreground">最坏时间</span>
                                    <span className="font-mono bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-xs">{algorithm.worstCase}</span>
                                </div>
                                <div className="flex justify-between py-1 pt-2 border-t border-dashed border-white/5">
                                    <span className="text-muted-foreground">空间复杂度</span>
                                    <span className="font-mono text-xs">{algorithm.spaceComplexity}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
