export type SortStep = {
    array: number[]
    highlightIndices: number[] // Usually for comparison
    swapIndices: number[]      // For swapping/overwriting
    completedIndices: number[]
    type: 'compare' | 'swap' | 'overwrite'
    description: string
}

export type SortingAlgorithm = (
    array: number[],
    update: (step: SortStep) => Promise<void>,
    signal: AbortSignal
) => Promise<void>

export interface AlgorithmMeta {
    id: string
    name: string
    description: string
    bestCase: string
    averageCase: string
    worstCase: string
    spaceComplexity: string
    stable: boolean
    func: SortingAlgorithm
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 1. Bubble Sort
export const bubbleSort: SortingAlgorithm = async (array, update, signal) => {
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (signal.aborted) return

            await update({
                array: [...arr],
                highlightIndices: [j, j + 1],
                swapIndices: [],
                completedIndices: [],
                type: 'compare',
                description: `正在比较 ${arr[j]} 和 ${arr[j + 1]}`
            })

            if (arr[j] > arr[j + 1]) {
                ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                await update({
                    array: [...arr],
                    highlightIndices: [],
                    swapIndices: [j, j + 1],
                    completedIndices: [],
                    type: 'swap',
                    description: `交换 ${arr[j + 1]} 和 ${arr[j]} (因为 ${arr[j + 1]} > ${arr[j]})`
                })
            }
        }
    }
    await update({
        array: arr,
        highlightIndices: [],
        swapIndices: [],
        completedIndices: arr.map((_, i) => i),
        type: 'overwrite',
        description: '排序完成'
    })
}

// 2. Selection Sort
export const selectionSort: SortingAlgorithm = async (array, update, signal) => {
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n; i++) {
        let minIdx = i
        for (let j = i + 1; j < n; j++) {
            if (signal.aborted) return
            await update({
                array: [...arr],
                highlightIndices: [minIdx, j],
                swapIndices: [],
                completedIndices: Array.from({ length: i }, (_, k) => k),
                type: 'compare',
                description: `寻找最小值: 比较当前最小 ${arr[minIdx]} 和 ${arr[j]}`
            })
            if (arr[j] < arr[minIdx]) {
                minIdx = j
            }
        }
        if (minIdx !== i) {
            ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
            await update({
                array: [...arr],
                highlightIndices: [],
                swapIndices: [i, minIdx],
                completedIndices: Array.from({ length: i }, (_, k) => k),
                type: 'swap',
                description: `交换: 将最小值 ${arr[i]} 放回位置 ${i}`
            })
        }
    }
    await update({
        array: arr,
        highlightIndices: [],
        swapIndices: [],
        completedIndices: arr.map((_, i) => i),
        type: 'overwrite',
        description: '排序完成'
    })
}

// 3. Insertion Sort
export const insertionSort: SortingAlgorithm = async (array, update, signal) => {
    const arr = [...array]
    const n = arr.length

    for (let i = 1; i < n; i++) {
        let key = arr[i]
        let j = i - 1

        await update({
            array: [...arr],
            highlightIndices: [i],
            swapIndices: [],
            completedIndices: [],
            type: 'compare',
            description: `提取元素 ${key} 准备插入`
        })

        while (j >= 0 && arr[j] > key) {
            if (signal.aborted) return
            arr[j + 1] = arr[j]
            await update({
                array: [...arr],
                highlightIndices: [],
                swapIndices: [j, j + 1], // Visually similar to swap
                completedIndices: [],
                type: 'swap',
                description: `元素 ${arr[j]} 大于 ${key}，向后移动`
            })
            j = j - 1
        }
        arr[j + 1] = key
        await update({
            array: [...arr],
            highlightIndices: [],
            swapIndices: [j + 1],
            completedIndices: [],
            type: 'overwrite',
            description: `将 ${key} 插入到位置 ${j + 1}`
        })
    }
    await update({
        array: arr,
        highlightIndices: [],
        swapIndices: [],
        completedIndices: arr.map((_, i) => i),
        type: 'overwrite',
        description: '排序完成'
    })
}

// 4. Shell Sort
export const shellSort: SortingAlgorithm = async (array, update, signal) => {
    const arr = [...array]
    const n = arr.length

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = arr[i]
            let j

            await update({
                array: [...arr],
                highlightIndices: [i],
                swapIndices: [],
                completedIndices: [],
                type: 'compare',
                description: `Gap=${gap}: 提取元素 ${temp}`
            })

            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                if (signal.aborted) return
                arr[j] = arr[j - gap]
                await update({
                    array: [...arr],
                    highlightIndices: [],
                    swapIndices: [j, j - gap],
                    completedIndices: [],
                    type: 'swap',
                    description: `移动 ${arr[j]} (Gap Comparison)`
                })
            }
            arr[j] = temp
            await update({
                array: [...arr],
                highlightIndices: [],
                swapIndices: [j],
                completedIndices: [],
                type: 'overwrite',
                description: `插入 ${temp} 到位置 ${j}`
            })
        }
    }
    await update({
        array: arr,
        highlightIndices: [],
        swapIndices: [],
        completedIndices: arr.map((_, i) => i),
        type: 'overwrite',
        description: '排序完成'
    })
}

// 5. Merge Sort
export const mergeSort: SortingAlgorithm = async (array, update, signal) => {
    let arr = [...array]
    const n = arr.length

    const merge = async (left: number, mid: number, right: number) => {
        const n1 = mid - left + 1;
        const n2 = right - mid;
        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = arr[left + i];
        for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

        let i = 0, j = 0, k = left;

        while (i < n1 && j < n2) {
            if (signal.aborted) return
            await update({
                array: [...arr],
                highlightIndices: [left + i, mid + 1 + j],
                swapIndices: [k],
                completedIndices: [],
                type: 'compare',
                description: `比较左侧 ${L[i]} 和右侧 ${R[j]}`
            })

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
            await update({
                array: [...arr],
                highlightIndices: [],
                swapIndices: [k - 1],
                completedIndices: [],
                type: 'overwrite',
                description: `合并: 放入 ${arr[k - 1]}`
            })
        }
        while (i < n1) {
            if (signal.aborted) return
            arr[k] = L[i];
            i++;
            k++;
            await update({
                array: [...arr],
                highlightIndices: [],
                swapIndices: [k - 1],
                completedIndices: [],
                type: 'overwrite',
                description: `合并剩余左侧: ${arr[k - 1]}`
            })
        }
        while (j < n2) {
            if (signal.aborted) return
            arr[k] = R[j];
            j++;
            k++;
            await update({
                array: [...arr],
                highlightIndices: [],
                swapIndices: [k - 1],
                completedIndices: [],
                type: 'overwrite',
                description: `合并剩余右侧: ${arr[k - 1]}`
            })
        }
    }

    const sort = async (left: number, right: number) => {
        if (left >= right) return;
        const mid = left + Math.floor((right - left) / 2);
        await sort(left, mid);
        await sort(mid + 1, right);
        await merge(left, mid, right);
    }

    await sort(0, n - 1);
    await update({
        array: arr,
        highlightIndices: [],
        swapIndices: [],
        completedIndices: arr.map((_, i) => i),
        type: 'overwrite',
        description: '排序完成'
    })
}


// 6. Quick Sort
export const quickSort: SortingAlgorithm = async (array, update, signal) => {
    const arr = [...array]

    const partition = async (low: number, high: number) => {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (signal.aborted) throw new Error('Aborted')
            await update({
                array: [...arr],
                highlightIndices: [j, high],
                swapIndices: [i + 1],
                completedIndices: [],
                type: 'compare',
                description: `比较 ${arr[j]} 和基准值 ${pivot}`
            })

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                await update({
                    array: [...arr],
                    highlightIndices: [],
                    swapIndices: [i, j],
                    completedIndices: [],
                    type: 'swap',
                    description: `交换 ${arr[i]} 和 ${arr[j]}`
                })
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        await update({
            array: [...arr],
            highlightIndices: [],
            swapIndices: [i + 1, high],
            completedIndices: [],
            type: 'swap',
            description: `放置基准值到正确位置`
        })
        return i + 1;
    }

    const sort = async (low: number, high: number) => {
        if (signal.aborted) return
        if (low < high) {
            try {
                const pi = await partition(low, high);
                await sort(low, pi - 1);
                await sort(pi + 1, high);
            } catch (e) {
                return;
            }
        }
    }

    await sort(0, arr.length - 1);
    await update({
        array: arr,
        highlightIndices: [],
        swapIndices: [],
        completedIndices: arr.map((_, i) => i),
        type: 'overwrite',
        description: '排序完成'
    })
}

// 7. Heap Sort
export const heapSort: SortingAlgorithm = async (array, update, signal) => {
    let arr = [...array]
    const n = arr.length

    const heapify = async (n: number, i: number) => {
        if (signal.aborted) return
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            await update({
                array: [...arr],
                highlightIndices: [left, largest],
                swapIndices: [],
                completedIndices: [],
                type: 'compare',
                description: `比较左子节点 ${arr[left]} 和父节点 ${arr[largest]}`
            })
            if (arr[left] > arr[largest]) largest = left;
        }

        if (right < n) {
            await update({
                array: [...arr],
                highlightIndices: [right, largest],
                swapIndices: [],
                completedIndices: [],
                type: 'compare',
                description: `比较右子节点 ${arr[right]} 和最大值 ${arr[largest]}`
            })
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            await update({
                array: [...arr],
                highlightIndices: [],
                swapIndices: [i, largest],
                completedIndices: [],
                type: 'swap',
                description: `调整堆结构: 交换 ${arr[i]} 和 ${arr[largest]}`
            })
            await heapify(n, largest);
        }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        if (signal.aborted) return
        [arr[0], arr[i]] = [arr[i], arr[0]];
        await update({
            array: [...arr],
            highlightIndices: [],
            swapIndices: [0, i],
            completedIndices: [],
            type: 'swap',
            description: `将堆顶最大值 ${arr[0]} 移到末尾`
        })
        await heapify(i, 0);
    }

    await update({
        array: arr,
        highlightIndices: [],
        swapIndices: [],
        completedIndices: arr.map((_, i) => i),
        type: 'overwrite',
        description: '排序完成'
    })
}

// 8. Radix Sort (LSD)
export const radixSort: SortingAlgorithm = async (array, update, signal) => {
    let arr = [...array]
    const getMax = (arr: number[]) => {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        return max;
    }

    const countSort = async (exp: number) => {
        const n = arr.length;
        const output = new Array(n).fill(0);
        const count = new Array(10).fill(0);

        for (let i = 0; i < n; i++) {
            if (signal.aborted) return
            await update({
                array: [...arr],
                highlightIndices: [i],
                swapIndices: [],
                completedIndices: [],
                type: 'compare',
                description: `按位计数: 处理数字 ${arr[i]} (位权重 ${exp})`
            })
            count[Math.floor(arr[i] / exp) % 10]++;
        }

        for (let i = 1; i < 10; i++) count[i] += count[i - 1];

        for (let i = n - 1; i >= 0; i--) {
            if (signal.aborted) return
            output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
            count[Math.floor(arr[i] / exp) % 10]--;
        }

        for (let i = 0; i < n; i++) {
            if (signal.aborted) return
            arr[i] = output[i];
            await update({
                array: [...arr],
                highlightIndices: [],
                swapIndices: [i],
                completedIndices: [],
                type: 'overwrite',
                description: `写回数组: 更新位置 ${i} 为 ${arr[i]}`
            })
        }
    }

    const m = getMax(arr);
    for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
        await countSort(exp);
    }

    await update({
        array: arr,
        highlightIndices: [],
        swapIndices: [],
        completedIndices: arr.map((_, i) => i),
        type: 'overwrite',
        description: '排序完成'
    })
}

export const ALGORITHMS: AlgorithmMeta[] = [
    {
        id: 'bubble',
        name: '冒泡排序 (Bubble Sort)',
        description: '通过重复交换相邻的逆序元素，使较大的元素逐渐"浮"到数组末端。',
        bestCase: 'O(n)',
        averageCase: 'O(n²)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
        func: bubbleSort,
    },
    {
        id: 'selection',
        name: '选择排序 (Selection Sort)',
        description: '每次从未排序部分找出最小元素，放到已排序部分的末尾。',
        bestCase: 'O(n²)',
        averageCase: 'O(n²)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: false,
        func: selectionSort,
    },
    {
        id: 'insertion',
        name: '插入排序 (Insertion Sort)',
        description: '将数组分为已排序和未排序两部分，每次将未排序元素插入到已排序部分的正确位置。',
        bestCase: 'O(n)',
        averageCase: 'O(n²)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
        func: insertionSort,
    },
    {
        id: 'shell',
        name: '希尔排序 (Shell Sort)',
        description: '插入排序的改进版，通过逐步缩小增量(gap)进行分组插入排序。',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: false,
        func: shellSort,
    },
    {
        id: 'merge',
        name: '归并排序 (Merge Sort)',
        description: '基于分治策略，将数组分成两半分别排序，然后合并有序数组。',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n log n)',
        spaceComplexity: 'O(n)',
        stable: true,
        func: mergeSort,
    },
    {
        id: 'quick',
        name: '快速排序 (Quick Sort)',
        description: '通过选取基准值(pivot)将数组分为两部分，递归排序。',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(log n)',
        stable: false,
        func: quickSort,
    },
    {
        id: 'heap',
        name: '堆排序 (Heap Sort)',
        description: '利用堆数据结构（最大堆/最小堆）进行排序。',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n log n)',
        spaceComplexity: 'O(1)',
        stable: false,
        func: heapSort,
    },
    {
        id: 'radix',
        name: '基数排序 (Radix Sort)',
        description: '非比较整数排序，按位（从低位到高位）进行桶排序。',
        bestCase: 'O(nk)',
        averageCase: 'O(nk)',
        worstCase: 'O(nk)',
        spaceComplexity: 'O(n+k)',
        stable: true,
        func: radixSort,
    },
]
