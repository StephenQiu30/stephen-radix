
归并排序（Merge Sort）是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。

## 功能特性

- **稳定性**：归并排序是稳定的排序算法。在合并过程中，如果两个元素相等，我们总是优先取左边分区（早出现的）的元素，从而保证了相对顺序。
- **时间复杂度**：始终为 $O(n \log n)$，无论最好、最坏还是平均情况。这使得它在处理大规模数据时性能非常可预测。
- **非原地排序**：需要 $O(n)$ 的额外空间来存储临时数组，这是它相比快速排序的一个主要劣势。
- **分治策略**：将问题一分为二，分别解决后再合并，是分治法的教科书级应用。

## 算法步骤

1. **申请空间**：创建一个与原序列等大的临时数组，用来存放合并后的序列。
2. **设定指针**：设定两个指针，最初位置分别为两个已经排序序列的起始位置。
3. **比较并复制**：比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置。
4. **循环继续**：重复步骤 3 直到某一指针达到序列尾。
5. **处理剩余**：将另一序列剩下的所有元素直接复制到合并序列尾。

## 复杂度分析

| 指标 | 描述 |
| --- | --- |
| **平均时间复杂度** | $O(n \log n)$ |
| **最坏时间复杂度** | $O(n \log n)$ |
| **最优时间复杂度** | $O(n \log n)$ |
| **空间复杂度** | $O(n)$ |
| **稳定性** | 稳定 |

## 应用场景

- **外部排序**：当数据量非常大，内存无法一次装下时（如处理 100GB 的日志文件），归并排序是标准解决方案。可以将文件分割成小块分别在内存排序，然后通过多路归并写入最终文件。
- **链表排序**：归并排序对链表非常友好，因为可以通过调整指针实现合并，不需要额外的 $O(n)$ 空间，且不需要像快排那样进行随机访问。
- **Timsort 的基础**：Python 和 Java 的默认排序算法 Timsort 是归并排序和插入排序的混合体，利用了归并排序的稳定性及合并有序子序列的高效性。

## 如何学习

- **理解“归并”**：拿两摞已经排好序的扑克牌（比如 1-10），把它们合并成一摞有序的牌。你会发现只需要比较顶上的两张牌，把小的拿走即可。这就是归并的核心。
- **递归树**：画出归并排序的递归树，理解每一层都在做什么。自顶向下是“分”，像切蛋糕一样切碎；自底向上是“治”，把切碎的蛋糕（有序子序列）一层层拼回去。
- **空间换时间**：理解为什么它需要额外的空间？因为为了保证 O(N) 的合并速度和稳定性，我们不能像快排那样在原数组里瞎跳，只能开辟新战场（temp 数组）来规规矩矩地排队。

## 练习题目

- [148. 排序链表](https://leetcode.cn/problems/sort-list/) - 归并排序是排序链表的最佳选择（空间复杂度 $O(1)$，因为无需额外辅助数组）。
- [88. 合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/) - 归并排序核心 `merge` 操作的单独练习。
- [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/) - 分治思想的进阶应用。
- [315. 计算右侧小于当前元素的个数](https://leetcode.cn/problems/count-of-smaller-numbers-after-self/) - 归并排序过程中统计逆序对的经典应用。

## 代码实现

### C

```c
void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];

    for (i = 0; i < n1; i++) L[i] = arr[l + i];
    for (j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    i = 0; 
    j = 0; 
    k = l; 
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
```

### C++

```cpp
void merge(vector<int>& arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    vector<int> L(n1), R(n2);

    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
```

### Java

```java
public class MergeSort {
    void merge(int arr[], int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int L[] = new int[n1];
        int R[] = new int[n2];

        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];

        int i = 0, j = 0;
        int k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }

    void sort(int arr[], int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }
}
```

### Python

```python
def merge(arr, l, m, r):
    n1 = m - l + 1
    n2 = r - m
    L = [0] * (n1)
    R = [0] * (n2)

    for i in range(0, n1):
        L[i] = arr[l + i]
    for j in range(0, n2):
        R[j] = arr[m + 1 + j]

    i = 0 
    j = 0 
    k = l 
    while i < n1 and j < n2:
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1

    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1

    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1

def merge_sort(arr, l, r):
    if l < r:
        m = l + (r - l) // 2
        merge_sort(arr, l, m)
        merge_sort(arr, m + 1, r)
        merge(arr, l, m, r)
```

### TypeScript

```typescript
export const mergeSort = async (array: number[]) => {
  const arr = [...array];
  const n = arr.length;

  const merge = (left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[left + i];
    for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      k++;
    }
    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
    }
    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
    }
  };

  const sort = (left: number, right: number) => {
    if (left >= right) return;
    const mid = left + Math.floor((right - left) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  };

  sort(0, n - 1);
  return arr;
};
```
