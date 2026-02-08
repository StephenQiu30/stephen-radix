
冒泡排序（Bubble Sort）是一种简单直观的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。

## 功能特性

- **简单直观**：逻辑简单，容易理解和实现，适合作为排序算法的入门教学。
- **稳定性**：冒泡排序是稳定的排序算法。因为只有当相邻两个元素大小不同且逆序时才交换，相等元素不会交换位置。
- **自适应性**：如果列表已经有序，经过改进的冒泡排序（增加标志位）只需遍历一次即可完成，时间复杂度为 $O(n)$。
- **原地排序**：空间复杂度为 $O(1)$，不需要额外的存储空间。

## 算法步骤

1. **比较相邻的元素**。如果第一个比第二个大，就交换他们两个。
2. **对每一对相邻元素作同样的工作**，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
3. **针对所有的元素重复以上的步骤**，除了最后一个。
4. **持续每次对越来越少的元素重复上面的步骤**，直到没有任何一对数字需要比较。

## 复杂度分析

| 指标 | 描述 |
| --- | --- |
| **平均时间复杂度** | $O(n^2)$ |
| **最坏时间复杂度** | $O(n^2)$ |
| **最优时间复杂度** | $O(n)$ |
| **空间复杂度** | $O(1)$ |
| **稳定性** | 稳定 |

## 应用场景

虽然冒泡排序在实际应用中因为效率较低而不常被用于处理大规模数据，但它在特定场景下仍有价值：
- **教学演示**：用于计算机科学导论课程，帮助学生理解算法的基本概念和循环结构。
- **小规模数据检查**：用于检测数组是否已经有序，或者对极小规模的数据（如少于 10 个元素）进行快速排序。
- **图形学处理**：在一些简单的计算机图形学算法中，用于处理多边形填充顺序等对性能要求不高的排序任务。

## 如何学习

- **理解核心思想**：想象气泡在水中上浮的过程，较大的元素通过交换慢慢“浮”到数组的末端。
- **动手模拟**：使用一副扑克牌，尝试按照冒泡排序的逻辑手动排序，观察每一次交换的过程。
- **可视化辅助**：观察动态的可视化演示，特别是注意每一轮最大的元素是如何被确定的。
- **代码实现**：尝试不看参考代码，自己手写实现。之后尝试优化代码，例如增加一个标志位来检测数组是否已经有序，从而提取结束排序。

## 练习题目

- [283. 移动零](https://leetcode.cn/problems/move-zeroes/) - 虽然最优解是双指针，但用冒泡思想（将0不断冒泡到末尾）是很好的练习。
- [912. 排序数组](https://leetcode.cn/problems/sort-an-array/) - 基础排序练习（冒泡在数据量大时会超时，仅用于小数据验证）。

## 代码实现

### C

```c
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
```

### C++

```cpp
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}
```

### Java

```java
public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}
```

### Python

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
```

### TypeScript

```typescript
export const bubbleSort = async (array: number[]) => {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
};
```
