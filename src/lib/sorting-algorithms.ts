export type SortStep = {
  array: number[]
  highlightIndices: number[] // Usually for comparison
  swapIndices: number[] // For swapping/overwriting
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
  visualizerType: 'bar' | 'scatter' | 'pyramid' | 'dots' | 'rainbow'
  detailedDescription: string
  realWorldUse: string[]
  tags: string[]
}

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
        description: `正在比较 ${arr[j]} 和 ${arr[j + 1]}`,
      })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        await update({
          array: [...arr],
          highlightIndices: [],
          swapIndices: [j, j + 1],
          completedIndices: [],
          type: 'swap',
          description: `交换 ${arr[j + 1]} 和 ${arr[j]} (因为 ${arr[j + 1]} > ${arr[j]})`,
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
    description: '排序完成',
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
        description: `寻找最小值: 比较当前最小 ${arr[minIdx]} 和 ${arr[j]}`,
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
        description: `交换: 将最小值 ${arr[i]} 放回位置 ${i}`,
      })
    }
  }
  await update({
    array: arr,
    highlightIndices: [],
    swapIndices: [],
    completedIndices: arr.map((_, i) => i),
    type: 'overwrite',
    description: '排序完成',
  })
}

// 3. Insertion Sort
export const insertionSort: SortingAlgorithm = async (array, update, signal) => {
  const arr = [...array]
  const n = arr.length

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    await update({
      array: [...arr],
      highlightIndices: [i],
      swapIndices: [],
      completedIndices: [],
      type: 'compare',
      description: `提取元素 ${key} 准备插入`,
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
        description: `元素 ${arr[j]} 大于 ${key}，向后移动`,
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
      description: `将 ${key} 插入到位置 ${j + 1}`,
    })
  }
  await update({
    array: arr,
    highlightIndices: [],
    swapIndices: [],
    completedIndices: arr.map((_, i) => i),
    type: 'overwrite',
    description: '排序完成',
  })
}

// 4. Shell Sort
export const shellSort: SortingAlgorithm = async (array, update, signal) => {
  const arr = [...array]
  const n = arr.length

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i]
      let j

      await update({
        array: [...arr],
        highlightIndices: [i],
        swapIndices: [],
        completedIndices: [],
        type: 'compare',
        description: `Gap=${gap}: 提取元素 ${temp}`,
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
          description: `移动 ${arr[j]} (Gap Comparison)`,
        })
      }
      arr[j] = temp
      await update({
        array: [...arr],
        highlightIndices: [],
        swapIndices: [j],
        completedIndices: [],
        type: 'overwrite',
        description: `插入 ${temp} 到位置 ${j}`,
      })
    }
  }
  await update({
    array: arr,
    highlightIndices: [],
    swapIndices: [],
    completedIndices: arr.map((_, i) => i),
    type: 'overwrite',
    description: '排序完成',
  })
}

// 5. Merge Sort
export const mergeSort: SortingAlgorithm = async (array, update, signal) => {
  const arr = [...array]
  const n = arr.length

  const merge = async (left: number, mid: number, right: number) => {
    const n1 = mid - left + 1
    const n2 = right - mid
    const L = new Array(n1)
    const R = new Array(n2)

    for (let i = 0; i < n1; i++) L[i] = arr[left + i]
    for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j]

    let i = 0,
      j = 0,
      k = left

    while (i < n1 && j < n2) {
      if (signal.aborted) return
      await update({
        array: [...arr],
        highlightIndices: [left + i, mid + 1 + j],
        swapIndices: [k],
        completedIndices: [],
        type: 'compare',
        description: `比较左侧 ${L[i]} 和右侧 ${R[j]}`,
      })

      if (L[i] <= R[j]) {
        arr[k] = L[i]
        i++
      } else {
        arr[k] = R[j]
        j++
      }
      k++
      await update({
        array: [...arr],
        highlightIndices: [],
        swapIndices: [k - 1],
        completedIndices: [],
        type: 'overwrite',
        description: `合并: 放入 ${arr[k - 1]}`,
      })
    }
    while (i < n1) {
      if (signal.aborted) return
      arr[k] = L[i]
      i++
      k++
      await update({
        array: [...arr],
        highlightIndices: [],
        swapIndices: [k - 1],
        completedIndices: [],
        type: 'overwrite',
        description: `合并剩余左侧: ${arr[k - 1]}`,
      })
    }
    while (j < n2) {
      if (signal.aborted) return
      arr[k] = R[j]
      j++
      k++
      await update({
        array: [...arr],
        highlightIndices: [],
        swapIndices: [k - 1],
        completedIndices: [],
        type: 'overwrite',
        description: `合并剩余右侧: ${arr[k - 1]}`,
      })
    }
  }

  const sort = async (left: number, right: number) => {
    if (left >= right) return
    const mid = left + Math.floor((right - left) / 2)
    await sort(left, mid)
    await sort(mid + 1, right)
    await merge(left, mid, right)
  }

  await sort(0, n - 1)
  await update({
    array: arr,
    highlightIndices: [],
    swapIndices: [],
    completedIndices: arr.map((_, i) => i),
    type: 'overwrite',
    description: '排序完成',
  })
}

// 6. Quick Sort
export const quickSort: SortingAlgorithm = async (array, update, signal) => {
  const arr = [...array]

  const partition = async (low: number, high: number) => {
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      if (signal.aborted) throw new Error('Aborted')
      await update({
        array: [...arr],
        highlightIndices: [j, high],
        swapIndices: [i + 1],
        completedIndices: [],
        type: 'compare',
        description: `比较 ${arr[j]} 和基准值 ${pivot}`,
      })

      if (arr[j] < pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        await update({
          array: [...arr],
          highlightIndices: [],
          swapIndices: [i, j],
          completedIndices: [],
          type: 'swap',
          description: `交换 ${arr[i]} 和 ${arr[j]}`,
        })
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    await update({
      array: [...arr],
      highlightIndices: [],
      swapIndices: [i + 1, high],
      completedIndices: [],
      type: 'swap',
      description: `放置基准值到正确位置`,
    })
    return i + 1
  }

  const sort = async (low: number, high: number) => {
    if (signal.aborted) return
    if (low < high) {
      try {
        const pi = await partition(low, high)
        await sort(low, pi - 1)
        await sort(pi + 1, high)
      } catch {
        return
      }
    }
  }

  await sort(0, arr.length - 1)
  await update({
    array: arr,
    highlightIndices: [],
    swapIndices: [],
    completedIndices: arr.map((_, i) => i),
    type: 'overwrite',
    description: '排序完成',
  })
}

// 7. Heap Sort
export const heapSort: SortingAlgorithm = async (array, update, signal) => {
  const arr = [...array]
  const n = arr.length

  const heapify = async (n: number, i: number) => {
    if (signal.aborted) return
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    if (left < n) {
      await update({
        array: [...arr],
        highlightIndices: [left, largest],
        swapIndices: [],
        completedIndices: [],
        type: 'compare',
        description: `比较左子节点 ${arr[left]} 和父节点 ${arr[largest]}`,
      })
      if (arr[left] > arr[largest]) largest = left
    }

    if (right < n) {
      await update({
        array: [...arr],
        highlightIndices: [right, largest],
        swapIndices: [],
        completedIndices: [],
        type: 'compare',
        description: `比较右子节点 ${arr[right]} 和最大值 ${arr[largest]}`,
      })
      if (arr[right] > arr[largest]) largest = right
    }

    if (largest !== i) {
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      await update({
        array: [...arr],
        highlightIndices: [],
        swapIndices: [i, largest],
        completedIndices: [],
        type: 'swap',
        description: `调整堆结构: 交换 ${arr[i]} 和 ${arr[largest]}`,
      })
      await heapify(n, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i)
  }

  for (let i = n - 1; i > 0; i--) {
    if (signal.aborted) return
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    await update({
      array: [...arr],
      highlightIndices: [],
      swapIndices: [0, i],
      completedIndices: [],
      type: 'swap',
      description: `将堆顶最大值 ${arr[0]} 移到末尾`,
    })
    await heapify(i, 0)
  }

  await update({
    array: arr,
    highlightIndices: [],
    swapIndices: [],
    completedIndices: arr.map((_, i) => i),
    type: 'overwrite',
    description: '排序完成',
  })
}

// 8. Radix Sort (LSD)
export const radixSort: SortingAlgorithm = async (array, update, signal) => {
  const arr = [...array]
  const getMax = (arr: number[]) => {
    let max = arr[0]
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) max = arr[i]
    }
    return max
  }

  const countSort = async (exp: number) => {
    const n = arr.length
    const output = new Array(n).fill(0)
    const count = new Array(10).fill(0)

    for (let i = 0; i < n; i++) {
      if (signal.aborted) return
      await update({
        array: [...arr],
        highlightIndices: [i],
        swapIndices: [],
        completedIndices: [],
        type: 'compare',
        description: `按位计数: 处理数字 ${arr[i]} (位权重 ${exp})`,
      })
      count[Math.floor(arr[i] / exp) % 10]++
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1]

    for (let i = n - 1; i >= 0; i--) {
      if (signal.aborted) return
      output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i]
      count[Math.floor(arr[i] / exp) % 10]--
    }

    for (let i = 0; i < n; i++) {
      if (signal.aborted) return
      arr[i] = output[i]
      await update({
        array: [...arr],
        highlightIndices: [],
        swapIndices: [i],
        completedIndices: [],
        type: 'overwrite',
        description: `写回数组: 更新位置 ${i} 为 ${arr[i]}`,
      })
    }
  }

  const m = getMax(arr)
  for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
    await countSort(exp)
  }

  await update({
    array: arr,
    highlightIndices: [],
    swapIndices: [],
    completedIndices: arr.map((_, i) => i),
    type: 'overwrite',
    description: '排序完成',
  })
}

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: 'bubble',
    name: '冒泡排序',
    description: '通过重复交换相邻的逆序元素，使较大的元素逐渐"浮"到数组末端。',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    func: bubbleSort,
    visualizerType: 'bar',
    detailedDescription: `
冒泡排序（Bubble Sort）是一种简单直观的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。

### 算法步骤
1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。
        `,
    realWorldUse: [
      '教学演示：由于逻辑简单，常用于计算机科学导论课程。',
      '小规模数据检查：检测数组是否已经有序。',
      '计算机图形学：处理简单的多边形填充顺序。',
    ],
    tags: ['交换排序', '稳定', '简单'],
  },
  {
    id: 'selection',
    name: '选择排序',
    description: '每次从未排序部分找出最小元素，放到已排序部分的末尾。',
    bestCase: 'O(n²)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    func: selectionSort,
    visualizerType: 'bar',
    detailedDescription: `
选择排序（Selection Sort）是一种简单直观的排序算法。它的工作原理是：第一次从待排序的数据元素中选出最小（或最大）的一个元素，存放在序列的起始位置，然后再从剩余的未排序元素中寻找到最小（大）元素，然后放到已排序的序列的末尾。

### 算法步骤
1. 在未排序序列中找到最小（大）元素，存放到排序序列的起始位置。
2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
3. 重复第二步，直到所有元素均排序完毕。
        `,
    realWorldUse: [
      '写入受限内存：当交换成本很高（如Flash存储擦写）时，选择排序因为交换次数最少（N次）而有优势。',
      '简单嵌入式系统：代码极其简单，适合资源极度受限环境。',
    ],
    tags: ['选择排序', '不稳定', '交换少'],
  },
  {
    id: 'insertion',
    name: '插入排序',
    description: '将数组分为已排序和未排序两部分，每次将未排序元素插入到已排序部分的正确位置。',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    func: insertionSort,
    visualizerType: 'bar',
    detailedDescription: `
插入排序（Insertion Sort）的算法描述是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

### 算法步骤
1. 从第一个元素开始，该元素可以认为已经被排序。
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描。
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置。
4. 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置。
5. 将新元素插入到该位置后。
6. 重复步骤2~5。
        `,
    realWorldUse: [
      '近似有序数组：对于基本有序的数据，效率极高（近乎O(n)）。',
      '小规模数据：在标准库排序实现中（如Java的TimSort），当分块数据量小于阈值时改用插入排序。',
    ],
    tags: ['插入排序', '稳定', '在线算法'],
  },
  {
    id: 'shell',
    name: '希尔排序',
    description: '插入排序的改进版，通过逐步缩小增量(gap)进行分组插入排序。',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    func: shellSort,
    visualizerType: 'bar',
    detailedDescription: `
希尔排序（Shell Sort）是插入排序的一种更高效的改进版本。希尔排序是非稳定排序算法。该方法因DL.Shell于1959年提出而得名。希尔排序是把记录按下标的一定增量分组，对每组使用直接插入排序算法排序；随着增量逐渐减少，每组包含的关键词越来越多，当增量减至1时，整个文件恰被分成一组，算法便终止。

### 算法特点
- 突破了O(n²)的界限。
- 比较在距离较远的元素间进行。
- 适合中等规模数据。
        `,
    realWorldUse: [
      '嵌入式系统：在标准C库（uClibc）中用于qsort实现。',
      '旧式系统维护：在硬件资源受限且无复杂库支持的场景。',
    ],
    tags: ['插入排序', '改进版', '不稳定'],
  },
  {
    id: 'merge',
    name: '归并排序',
    description: '基于分治策略，将数组分成两半分别排序，然后合并有序数组。',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    spaceComplexity: 'O(n)',
    stable: true,
    func: mergeSort,
    visualizerType: 'bar',
    detailedDescription: `
归并排序（Merge Sort）是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。

### 算法步骤
1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列。
2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置。
3. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置。
4. 重复步骤3直到某一指针达到序列尾。
5. 将另一序列剩下的所有元素直接复制到合并序列尾。
        `,
    realWorldUse: [
      '外部排序：处理海量数据（超过内存限制）的标准算法。',
      '链表排序：因为不需要随机访问，且只需改变指针连接。',
      'Python/Java：Timsort的核心思想之一。',
    ],
    tags: ['分治法', '稳定', '外部排序'],
  },
  {
    id: 'quick',
    name: '快速排序',
    description: '通过选取基准值(pivot)将数组分为两部分，递归排序。',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(log n)',
    stable: false,
    func: quickSort,
    visualizerType: 'bar',
    detailedDescription: `
快速排序（Quick Sort）由Tony Hoare在1960年提出。它的基本思想是：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。

### 核心思想
- **分治法（Divide and Conquer）**
- **Partition（分区）**：这是快排的核心，选取一个基准值，将小于它的放左边，大于它的放右边。
        `,
    realWorldUse: [
      '标准库默认排序：C++ STL sort, Java Arrays.sort (dual-pivot) 等大多基于快排。',
      '通用场景：平均性能最优的通用排序算法。',
    ],
    tags: ['分治法', '不稳定', '最快'],
  },
  {
    id: 'heap',
    name: '堆排序',
    description: '利用堆数据结构（最大堆/最小堆）进行排序。',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    spaceComplexity: 'O(1)',
    stable: false,
    func: heapSort,
    visualizerType: 'bar',
    detailedDescription: `
堆排序（Heap Sort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。

### 算法步骤
1. 将无序序列构建成一个堆，根据升序降序需求选择大顶堆或小顶堆。
2. 将堆顶元素与末尾元素交换，将最大元素"沉"到数组末端。
3. 重新调整结构，使其满足堆定义，然后继续交换堆顶元素与当前末尾元素，反复执行调整+交换步骤，直到整个序列有序。
        `,
    realWorldUse: [
      '系统级编程：Linux内核中用于内存管理等场景，因为最坏情况也有保证，且无需额外O(n)空间。',
      '优先队列：Top K问题的高效解法。',
    ],
    tags: ['选择排序', '不稳定', '堆结构'],
  },
  {
    id: 'radix',
    name: '基数排序',
    description: '非比较整数排序，按位（从低位到高位）进行桶排序。',
    bestCase: 'O(nk)',
    averageCase: 'O(nk)',
    worstCase: 'O(nk)',
    spaceComplexity: 'O(n+k)',
    stable: true,
    func: radixSort,
    visualizerType: 'bar',
    detailedDescription: `
基数排序（Radix Sort）属于"分配式排序"（Distribution Sort），又称"桶子法"（Bucket Sort或Bin Sort）。顾名思义，它是透过键值的部份资讯，将要排序的元素分配至某些"桶"中，以达到排序的作用，基数排序属于稳定排序，其时间复杂度为O(nlog(r)m)，其中r为所采取的基数，而m为堆数，在某些时候，基数排序法的效率高于其它的稳定性排序法。

### 算法原理
将所有待比较数值（正整数）统一为同样的数位长度，数位较短的数前面补零。然后，从最低位排序开始，依次进行一次排序。这样从最低位排序一直到最高位排序完成以后，数列就变成一个有序序列。
        `,
    realWorldUse: [
      '字符串排序：处理定长字符串或IP地址排序。',
      '大数据处理：当数值范围确定且k较小时，比比较类排序更快。',
      'Suffix Array构建算法。',
    ],
    tags: ['非比较排序', '稳定', '线性时间'],
  },
]
