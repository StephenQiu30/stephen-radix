快速排序（Quick Sort）由Tony
Hoare在1960年提出。它的基本思想是：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。

## 功能特性

- **高效性**：平均时间复杂度为 $O(n \log n)$，且隐含的常数因子很小，通常比归并排序和堆排序更快。
- **不稳定性**：快速排序是不稳定的。因为在交换过程中，相等的元素可能会改变相对位置。
- **原地排序（广义）**：空间复杂度为 $O(\log n)$（递归栈），不需要像归并排序那样分配 $O(n)$ 的额外空间。
- **分治策略**：典型的分治思想应用，将大问题分解为小问题解决。

## 核心思想

1. **选基准（Pivot）**：从数列中挑出一个元素，称为 "基准"。
2. **分区（Partition）**：重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。
3. **递归（Recursive）**：递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。

## 复杂度分析

| 指标          | 描述            |
|-------------|---------------|
| **平均时间复杂度** | $O(n \log n)$ |
| **最坏时间复杂度** | $O(n^2)$      |
| **最优时间复杂度** | $O(n \log n)$ |
| **空间复杂度**   | $O(\log n)$   |
| **稳定性**     | 不稳定           |

## 应用场景

- **通用排序**：是大多数系统库（如 C++ STL 的 `std::sort`，Java 的 `Arrays.sort` 对基本类型）的默认排序算法实现基础。
- **大数据处理**：在内存足够但又不希望占用太多额外空间（相比归并排序）时非常适用。
- **随机数据**：对于完全随机的数据，快速排序的表现通常是最好的。

## 如何学习

- **理解 Partition**：这是快排的灵魂。重点理解如何通过双指针（或单指针）将数组分为两部分，左边都比 pivot 小，右边都比 pivot 大。
- **递归思维**：不要陷进去层层递归的细节，而是相信 fetch-and-conquer（分而治之）。假设子数组已经排好了，通过 partition
  组合起来就是有序的。
- **Pivot 的选择**：思考为什么如果每次都选第一个元素作为 pivot，在处理有序数组时会退化成 $O(n^2)$？了解随机选 pivot
  或三数取中法（Median-of-Three）是如何避免这个问题的。

## 练习题目

- [912. 排序数组](https://leetcode.cn/problems/sort-an-array/) - 手写快排是面试高频题，注意处理随机化 Pivot 以避免超时。
- [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/) - 快速选择算法（Quick
  Select）是快排思想的变种，时间复杂度 $O(N)$。
- [75. 颜色分类](https://leetcode.cn/problems/sort-colors/) - 经典的“荷兰国旗问题”，考察三路快排（3-way Partition）思想。

## 代码实现

### C

```c
void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```

### C++

```cpp
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```

### Java

```java
public class QuickSort {
    int partition(int arr[], int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    void sort(int arr[], int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }
}
```

### Python

```python
def partition(arr, low, high):
    i = (low - 1)
    pivot = arr[high]
    for j in range(low, high):
        if arr[j] < pivot:
            i = i + 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return (i + 1)

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
```

### TypeScript

```typescript
export const quickSort = async (array: number[]) => {
  const arr = [...array]

  const partition = (low: number, high: number) => {
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    return i + 1
  }

  const sort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high)
      sort(low, pi - 1)
      sort(pi + 1, high)
    }
  }

  sort(0, arr.length - 1)
  return arr
}
```
