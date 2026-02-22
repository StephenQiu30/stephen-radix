选择排序（Selection
Sort）是一种简单直观的排序算法。它的工作原理是：第一次从待排序的数据元素中选出最小（或最大）的一个元素，存放在序列的起始位置，然后再从剩余的未排序元素中寻找到最小（大）元素，然后放到已排序的序列的末尾。

## 功能特性

- **简单性**：算法逻辑非常简单，容易实现。
- **不稳定性**：选择排序是一种不稳定的排序算法。例如，序列 `[5, 5, 2]`，第一轮会将第一个 5 和 2 交换，导致两个 5 的相对顺序改变。
- **固定时间复杂度**：无论输入数据是否已经有序，选择排序的时间复杂度始终为 $O(n^2)$，这一特性使得它在某些特定实时系统中可能具有可预测性。
- **原地排序**：空间复杂度为 $O(1)$。
- **交换次数少**：相比冒泡排序，选择排序的交换次数更少（最多 $n-1$ 次），如果交换操作（如写内存）代价很高，选择排序可能优于冒泡排序。

## 算法步骤

1. **查找最小（大）元素**：在未排序序列中找到最小（大）元素，存放到排序序列的起始位置。
2. **继续查找**：再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
3. **重复步骤**：重复第二步，直到所有元素均排序完毕。

## 复杂度分析

| 指标          | 描述       |
|-------------|----------|
| **平均时间复杂度** | $O(n^2)$ |
| **最坏时间复杂度** | $O(n^2)$ |
| **最优时间复杂度** | $O(n^2)$ |
| **空间复杂度**   | $O(1)$   |
| **稳定性**     | 不稳定      |

## 应用场景

- **内存写入敏感系统**：由于选择排序的交换次数（写入操作）最少（$O(n)$），在写入存储器寿命有限（如某些嵌入式系统的
  EEPROM）或写入操作昂贵的场景下，比冒泡排序或插入排序更具优势。
- **小规模数据且不要求稳定**：当数据量很少，且对原序列中相同元素的相对位置没有要求时，可以使用。
- **教学示例**：用于展示“每次选择最好/最坏”这种贪心策略的简单应用。

## 如何学习

- **类比记忆**：这就好比在操场上排队，教官每次从队伍里挑出最矮的一个人，让他站到第一位，然后再从剩下的人里挑最矮的站第二位，以此类推。
- **关注“交换”**：注意它与冒泡排序的区别，冒泡是频繁交换，选择排序是每轮只交换一次（找到最小的之后再交换）。
- **理解不稳定**：尝试手动模拟序列 `[5, 8, 5, 2, 9]` 的排序过程，观察两个 `5` 的位置变化，理解为什么它是不稳定的。

## 练习题目

- [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/) - 选择排序的变种（只选前 K
  次）可以解决此问题（虽然时间复杂度较高）。
- [912. 排序数组](https://leetcode.cn/problems/sort-an-array/) - 基础排序练习。

## 代码实现

### C

```c
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        if (min_idx != i) {
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }
}
```

### C++

```cpp
void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        if (min_idx != i) {
            swap(arr[min_idx], arr[i]);
        }
    }
}
```

### Java

```java
public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[min_idx])
                    min_idx = j;
            }
            if (min_idx != i) {
                int temp = arr[min_idx];
                arr[min_idx] = arr[i];
                arr[i] = temp;
            }
        }
    }
}
```

### Python

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
```

### TypeScript

```typescript
export const selectionSort = async (array: number[]) => {
  const arr = [...array]
  const n = arr.length

  for (let i = 0; i < n; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j
      }
    }
    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
    }
  }
  return arr
}
```
