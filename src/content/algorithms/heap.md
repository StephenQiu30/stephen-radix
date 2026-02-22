堆排序（Heap Sort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。

## 功能特性

- **时间复杂度**：平均、最好、最坏情况下的时间复杂度均为 $O(n \log n)$。
- **不稳定性**：堆排序是不稳定的。因为在堆顶与堆尾交换时，可能会改变相等元素的相对位置。
- **原地排序**：空间复杂度为 $O(1)$。
- **数据结构依赖**：深度依赖“堆”这种完全二叉树结构，是理解优先队列（Priority Queue）的基础。

## 算法步骤

1. **构建初始堆**：将无序序列构建成一个堆，根据升序降序需求选择大顶堆（升序）或小顶堆（降序）。
2. **交换堆顶**：将堆顶元素（最大或最小）与末尾元素交换，将最大元素"沉"到数组末端。
3. **调整堆（Heapify）**：将剩余 $n-1$ 个元素重新调整结构，使其满足堆定义。
4. **重复执行**：继续交换堆顶元素与当前末尾元素，反复执行调整+交换步骤，直到整个序列有序。

## 复杂度分析

| 指标          | 描述            |
|-------------|---------------|
| **平均时间复杂度** | $O(n \log n)$ |
| **最坏时间复杂度** | $O(n \log n)$ |
| **最优时间复杂度** | $O(n \log n)$ |
| **空间复杂度**   | $O(1)$        |
| **稳定性**     | 不稳定           |

## 应用场景

- **系统级编程**：Linux 内核中在处理内存管理等任务时，由于堆排序提供最坏情况 $O(n \log n)$
  的保证，且不需要额外内存（原地排序），因此在对内存限制极严或要求不可出现 $O(N^2)$ 最坏情况的场景下非常有用。
- **Top K 问题**：寻找数组中前 K 个最大（或最小）的元素时，不需要对整个数组排序，只需维护一个大小为 K
  的堆，可以在 $O(n \log K)$ 时间内解决。
- **优先队列**：堆排序底层的二叉堆数据结构是实现优先队列的首选。

## 如何学习

- **画二叉树**：不要只看数组索引，一定要在纸上画出完全二叉树的结构，标上数组索引（左孩子 $2i+1$，右孩子 $2i+2$）。
- **理解“下沉”（Sift Down）**：这是 `heapify` 的核心。想象一个重物（较小的值在大顶堆中）在堆顶，它需要一步步跟比较大的子节点交换，直到落到正确的位置。
- **区分建堆和排序**：建堆是 $O(n)$，排序是 $O(n \log n)$。理解为什么建堆是从最后一个非叶子节点开始倒着做 `heapify`。

## 练习题目

- [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/) - 建立大小为 K 的堆是解决此类
  Top K 问题的标准解法。
- [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/) - 优先级队列（堆）的典型应用。
- [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/) - 使用最小堆维护 K 个链表的头节点。

## 代码实现

### C

```c
void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}
```

### C++

```cpp
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}
```

### Java

```java
public class HeapSort {
    void heapify(int arr[], int n, int i) {
        int largest = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;

        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;

        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
            heapify(arr, n, largest);
        }
    }

    public void sort(int arr[]) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            heapify(arr, i, 0);
        }
    }
}
```

### Python

```python
def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2

    if l < n and arr[l] > arr[largest]:
        largest = l

    if r < n and arr[r] > arr[largest]:
        largest = r

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)
```

### TypeScript

```typescript
export const heapSort = async (array: number[]) => {
  const arr = [...array]
  const n = arr.length

  const heapify = (n: number, i: number) => {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    if (left < n && arr[left] > arr[largest]) largest = left
    if (right < n && arr[right] > arr[largest]) largest = right

    if (largest !== i) {
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      heapify(n, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i)
  }

  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    heapify(i, 0)
  }
  return arr
}
```
