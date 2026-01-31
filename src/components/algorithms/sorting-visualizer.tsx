'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings2, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sorting Algorithms
const bubbleSort = async (
    arr: number[],
    setArr: (arr: number[]) => void,
    speed: number,
    signal: AbortSignal
) => {
    const len = arr.length
    let checked = false
    const tempArr = [...arr]

    do {
        checked = false
        for (let i = 0; i < len - 1; i++) {
            if (signal.aborted) return
            if (tempArr[i] > tempArr[i + 1]) {
                const temp = tempArr[i]
                tempArr[i] = tempArr[i + 1]
                tempArr[i + 1] = temp
                setArr([...tempArr])
                checked = true
                await new Promise((resolve) => setTimeout(resolve, speed))
            }
        }
    } while (checked)
}

const quickSort = async (
    arr: number[],
    setArr: (arr: number[]) => void,
    speed: number,
    signal: AbortSignal
) => {
    const tempArr = [...arr]

    const partition = async (left: number, right: number) => {
        if (signal.aborted) return -1
        const pivot = tempArr[Math.floor((right + left) / 2)]
        let i = left
        let j = right

        while (i <= j) {
            while (tempArr[i] < pivot) i++
            while (tempArr[j] > pivot) j--
            if (i <= j) {
                if (signal.aborted) return -1;
                [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]]
                setArr([...tempArr])
                await new Promise((resolve) => setTimeout(resolve, speed))
                i++
                j--
            }
        }
        return i
    }

    const sort = async (left: number, right: number) => {
        if (signal.aborted) return
        if (arr.length > 1) {
            const index = await partition(left, right)
            if (index === -1) return // Aborted
            if (left < index - 1) await sort(left, index - 1)
            if (index < right) await sort(index, right)
        }
    }

    await sort(0, tempArr.length - 1)
}

const mergeSort = async (
    arr: number[],
    setArr: (arr: number[]) => void,
    speed: number,
    signal: AbortSignal
) => {
    const tempArr = [...arr];

    const merge = async (left: number, middle: number, right: number) => {
        if (signal.aborted) return;

        const n1 = middle - left + 1;
        const n2 = right - middle;

        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = tempArr[left + i];
        for (let j = 0; j < n2; j++) R[j] = tempArr[middle + 1 + j];

        let i = 0;
        let j = 0;
        let k = left;

        while (i < n1 && j < n2) {
            if (signal.aborted) return;
            if (L[i] <= R[j]) {
                tempArr[k] = L[i];
                i++;
            } else {
                tempArr[k] = R[j];
                j++;
            }
            // Update visualization for each swap/overwrite
            setArr([...tempArr]);
            await new Promise((resolve) => setTimeout(resolve, speed));
            k++;
        }

        while (i < n1) {
            if (signal.aborted) return;
            tempArr[k] = L[i];
            setArr([...tempArr]);
            await new Promise((resolve) => setTimeout(resolve, speed));
            i++;
            k++;
        }

        while (j < n2) {
            if (signal.aborted) return;
            tempArr[k] = R[j];
            setArr([...tempArr]);
            await new Promise((resolve) => setTimeout(resolve, speed));
            j++;
            k++;
        }
    }

    const sort = async (left: number, right: number) => {
        if (signal.aborted) return;
        if (left >= right) return;

        const middle = left + Math.floor((right - left) / 2);

        await sort(left, middle);
        await sort(middle + 1, right);
        await merge(left, middle, right);
    }

    await sort(0, tempArr.length - 1);
}


const ALGORITHMS = [
    { name: 'Bubble Sort', func: bubbleSort },
    { name: 'Quick Sort', func: quickSort },
    { name: 'Merge Sort', func: mergeSort },
]

export default function SortingVisualizer() {
    const [data, setData] = useState<number[]>([])
    const [sorting, setSorting] = useState(false)
    const [selectedAlgo, setSelectedAlgo] = useState(0)
    const [dataSize, setDataSize] = useState(30)
    const [speed, setSpeed] = useState(50)
    const abortControllerRef = useRef<AbortController | null>(null)

    // Generate random data
    const generateData = useCallback(() => {
        if (sorting) return
        const newData = Array.from({ length: dataSize }, () =>
            Math.floor(Math.random() * 100) + 5
        )
        setData(newData)
    }, [dataSize, sorting])

    useEffect(() => {
        generateData()
    }, [generateData])

    const handleSort = async () => {
        if (sorting) {
            // Stop sorting
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            setSorting(false)
            return
        }

        setSorting(true)
        const controller = new AbortController()
        abortControllerRef.current = controller

        try {
            await ALGORITHMS[selectedAlgo].func(data, setData, speed, controller.signal)
        } finally {
            if (!controller.signal.aborted) {
                setSorting(false)
            }
        }
    }

    const handleReset = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        setSorting(false)
        generateData()
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Visualizer Container */}
            <div className="relative aspect-video w-full bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col items-center justify-end p-8 sm:p-12 transition-all duration-500 hover:shadow-primary/10 hover:border-white/30 group">

                {/* Bars */}
                <div className="flex items-end justify-center w-full h-full gap-1 sm:gap-2">
                    <AnimatePresence>
                        {data.map((value, idx) => (
                            <motion.div
                                key={idx}
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: `${value}%` }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                className={cn(
                                    "w-full rounded-t-md sm:rounded-t-lg shadow-sm transition-colors duration-200",
                                    sorting ? "bg-primary" : "bg-primary/80 group-hover:bg-primary"
                                )}
                                style={{
                                    backgroundColor: sorting
                                        ? undefined
                                        : `hsl(var(--primary) / ${0.3 + (value / 100) * 0.7})`
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Overlay Controls (Glassmorphism) */}
                <div className="absolute top-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg">
                        {ALGORITHMS.map((algo, idx) => (
                            <button
                                key={algo.name}
                                onClick={() => !sorting && setSelectedAlgo(idx)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                                    selectedAlgo === idx
                                        ? "bg-white text-black shadow-md"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                )}
                                disabled={sorting}
                            >
                                {algo.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-105 active:scale-95"
                            title="Reset Data"
                        >
                            <RotateCcw size={20} />
                        </button>
                        <button
                            onClick={handleSort}
                            className={cn(
                                "p-3 rounded-full text-white backdrop-blur-md border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-lg",
                                sorting ? "bg-red-500/80 hover:bg-red-500" : "bg-primary hover:bg-primary/90"
                            )}
                            title={sorting ? "Stop" : "Start Sorting"}
                        >
                            {sorting ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Controls / Info */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center justify-center sm:justify-start gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Real-time Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Visualize algorithms in action. Watch how data is processed step-by-step.
                    </p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center justify-center sm:justify-start gap-2">
                        <Settings2 className="w-5 h-5 text-primary" />
                        Customizable
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Adjust speed and data size to understand complexity at your own pace.
                    </p>
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-4">
                    <div className="flex flex-col items-center sm:items-end gap-1">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Speed</span>
                        <input
                            type="range"
                            min="1"
                            max="200"
                            value={201 - speed}
                            onChange={(e) => setSpeed(201 - parseInt(e.target.value))}
                            disabled={sorting}
                            className="w-24 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                    <div className="flex flex-col items-center sm:items-end gap-1">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Items</span>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={dataSize}
                            onChange={(e) => setDataSize(parseInt(e.target.value))}
                            disabled={sorting}
                            className="w-24 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
