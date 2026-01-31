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
    const [speed, setSpeed] = useState(50)
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
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-3xl border-white/20 sm:rounded-3xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 z-10 bg-background/50 backdrop-blur-md">
                    <div className="space-y-1">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            {algorithm.name}
                            <Badge variant="outline" className="text-xs font-normal border-white/20">
                                {algorithm.bestCase}
                            </Badge>
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground max-w-2xl">
                            {algorithm.description}
                        </DialogDescription>
                    </div>
                    {/* Default Close button is sufficient usually, but we can add custom controls if needed */}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* Canvas Area */}
                    <div className="flex-1 relative bg-secondary/5 p-4 sm:p-8 flex flex-col items-center justify-end">
                        {/* Step Description */}
                        <div className="absolute top-6 left-0 right-0 text-center px-4 pointer-events-none z-50">
                            <span className="inline-block px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-white/10 shadow-lg text-sm font-medium text-foreground transition-all duration-200">
                                {stepDescription || '准备就绪'}
                            </span>
                        </div>

                        <div className="w-full h-full max-h-[60vh] md:max-h-full aspect-video md:aspect-auto rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm p-4 shadow-inner">
                            <SortingCanvas
                                data={data}
                                highlightIndices={highlightIndices}
                                swapIndices={swapIndices}
                                completedIndices={completedIndices}
                            />
                        </div>
                    </div>

                    {/* Sidebar Controls */}
                    <div className="w-full md:w-80 border-l border-white/10 bg-background/50 backdrop-blur-md p-6 flex flex-col gap-8 z-10 overflow-y-auto">

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Settings2 className="w-4 h-4" /> 控制台
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                {isSorting ? (
                                    <>
                                        <Button
                                            size="lg"
                                            onClick={handlePauseToggle}
                                            className={isPaused ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}
                                        >
                                            {isPaused ? (
                                                <><Play className="mr-2 h-4 w-4" /> 继续</>
                                            ) : (
                                                <><MonitorPause className="mr-2 h-4 w-4" /> 暂停</>
                                            )}
                                        </Button>

                                        {isPaused ? (
                                            <Button size="lg" onClick={handleStepForward} variant="outline">
                                                <StepForward className="mr-2 h-4 w-4" /> 单步
                                            </Button>
                                        ) : (
                                            <Button size="lg" variant="destructive" onClick={handleStop}>
                                                <X className="mr-2 h-4 w-4" /> 停止
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            size="lg"
                                            onClick={handleSort}
                                            className="bg-primary hover:bg-primary/90 col-span-2"
                                        >
                                            <Play className="mr-2 h-4 w-4" /> 开始演示
                                        </Button>
                                    </>
                                )}

                                {!isSorting && (
                                    <Button size="lg" variant="outline" onClick={handleReset} className="col-span-2">
                                        <RotateCcw className="mr-2 h-4 w-4" /> 重置数据
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">速度</span>
                                    <span className="font-mono">{speed}%</span>
                                </div>
                                <Slider
                                    value={[speed]}
                                    min={1}
                                    max={100}
                                    step={1}
                                    onValueChange={([v]) => setSpeed(v)}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">数量</span>
                                    <span className="font-mono">{size}</span>
                                </div>
                                <Slider
                                    value={[size]}
                                    min={10}
                                    max={200}
                                    step={10}
                                    onValueChange={([v]) => setSize(v)}
                                    disabled={isSorting}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">自定义数据</span>
                                </div>
                                <Input
                                    placeholder="例如: 50, 10, 20"
                                    value={customDataInput}
                                    onChange={handleCustomDataChange}
                                    disabled={isSorting}
                                    className="bg-secondary/20 border-white/10"
                                />
                                <p className="text-xs text-muted-foreground">请输入逗号分隔的数字</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">算法复杂度</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1 border-b border-white/5">
                                    <span className="text-muted-foreground">最优时间</span>
                                    <span className="font-mono">{algorithm.bestCase}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-white/5">
                                    <span className="text-muted-foreground">平均时间</span>
                                    <span className="font-mono">{algorithm.averageCase}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-white/5">
                                    <span className="text-muted-foreground">最坏时间</span>
                                    <span className="font-mono">{algorithm.worstCase}</span>
                                </div>
                                <div className="flex justify-between py-1 pt-2">
                                    <span className="text-muted-foreground">空间复杂度</span>
                                    <span className="font-mono">{algorithm.spaceComplexity}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
