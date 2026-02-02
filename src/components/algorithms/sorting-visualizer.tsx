'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Pause, Play, RotateCcw, Settings2 } from 'lucide-react'
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
        await new Promise(resolve => setTimeout(resolve, speed))
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
        if (signal.aborted) return -1
        ;[tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]]
        setArr([...tempArr])
        await new Promise(resolve => setTimeout(resolve, speed))
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
  const tempArr = [...arr]

  const merge = async (left: number, middle: number, right: number) => {
    if (signal.aborted) return

    const n1 = middle - left + 1
    const n2 = right - middle

    const L = new Array(n1)
    const R = new Array(n2)

    for (let i = 0; i < n1; i++) L[i] = tempArr[left + i]
    for (let j = 0; j < n2; j++) R[j] = tempArr[middle + 1 + j]

    let i = 0
    let j = 0
    let k = left

    while (i < n1 && j < n2) {
      if (signal.aborted) return
      if (L[i] <= R[j]) {
        tempArr[k] = L[i]
        i++
      } else {
        tempArr[k] = R[j]
        j++
      }
      // Update visualization for each swap/overwrite
      setArr([...tempArr])
      await new Promise(resolve => setTimeout(resolve, speed))
      k++
    }

    while (i < n1) {
      if (signal.aborted) return
      tempArr[k] = L[i]
      setArr([...tempArr])
      await new Promise(resolve => setTimeout(resolve, speed))
      i++
      k++
    }

    while (j < n2) {
      if (signal.aborted) return
      tempArr[k] = R[j]
      setArr([...tempArr])
      await new Promise(resolve => setTimeout(resolve, speed))
      j++
      k++
    }
  }

  const sort = async (left: number, right: number) => {
    if (signal.aborted) return
    if (left >= right) return

    const middle = left + Math.floor((right - left) / 2)

    await sort(left, middle)
    await sort(middle + 1, right)
    await merge(left, middle, right)
  }

  await sort(0, tempArr.length - 1)
}

const ALGORITHMS = [
  { name: '冒泡排序', func: bubbleSort },
  { name: '快速排序', func: quickSort },
  { name: '归并排序', func: mergeSort },
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
    const newData = Array.from({ length: dataSize }, () => Math.floor(Math.random() * 100) + 5)
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
    <div className="mx-auto w-full max-w-4xl">
      {/* Visualizer Container */}
      <div className="hover:shadow-primary/10 bg-secondary/30 group relative flex aspect-video w-full flex-col items-center justify-end overflow-hidden rounded-[32px] border border-white/20 p-8 shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-white/30 sm:p-12 dark:border-white/10">
        {/* Bars */}
        <div className="flex h-full w-full items-end justify-center gap-1 sm:gap-2">
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
                  'w-full rounded-t-md shadow-sm transition-colors duration-200 sm:rounded-t-lg',
                  sorting ? 'bg-primary' : 'bg-primary/80 group-hover:bg-primary'
                )}
                style={{
                  backgroundColor: sorting
                    ? undefined
                    : `hsl(var(--primary) / ${0.3 + (value / 100) * 0.7})`,
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Overlay Controls (Glassmorphism) */}
        <div className="absolute top-6 right-6 left-6 z-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="bg-secondary/30 flex items-center gap-2 rounded-2xl border border-white/10 p-2 shadow-lg backdrop-blur-md">
            {ALGORITHMS.map((algo, idx) => (
              <button
                key={algo.name}
                onClick={() => !sorting && setSelectedAlgo(idx)}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300',
                  selectedAlgo === idx
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
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
              className="rounded-full border border-white/10 bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
              title="重置数据"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={handleSort}
              className={cn(
                'rounded-full border border-white/10 p-3 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95',
                sorting ? 'bg-red-500/80 hover:bg-red-500' : 'bg-primary hover:bg-primary/90'
              )}
              title={sorting ? '停止' : '开始排序'}
            >
              {sorting ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Controls / Info */}
      <div className="mt-8 grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:text-left">
        <div className="space-y-2">
          <h3 className="flex items-center justify-center gap-2 text-lg font-semibold sm:justify-start">
            <BarChart3 className="text-primary h-5 w-5" />
            实时分析
          </h3>
          <p className="text-muted-foreground text-sm">可视化算法运行。逐步观察数据处理过程。</p>
        </div>
        <div className="space-y-2">
          <h3 className="flex items-center justify-center gap-2 text-lg font-semibold sm:justify-start">
            <Settings2 className="text-primary h-5 w-5" />
            完全可定制
          </h3>
          <p className="text-muted-foreground text-sm">调整速度和数据量，按需理解算法复杂度。</p>
        </div>
        <div className="flex items-center justify-center gap-4 sm:justify-end">
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              速度
            </span>
            <input
              type="range"
              min="1"
              max="200"
              value={201 - speed}
              onChange={e => setSpeed(201 - parseInt(e.target.value))}
              disabled={sorting}
              className="bg-secondary accent-primary h-1.5 w-24 cursor-pointer appearance-none rounded-lg"
            />
          </div>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              数据量
            </span>
            <input
              type="range"
              min="10"
              max="100"
              value={dataSize}
              onChange={e => setDataSize(parseInt(e.target.value))}
              disabled={sorting}
              className="bg-secondary accent-primary h-1.5 w-24 cursor-pointer appearance-none rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
