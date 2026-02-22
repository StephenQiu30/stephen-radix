插入排序（Insertion Sort）的算法描述是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

## 功能特性

- **适应性**：对于部分有序的数组，插入排序非常高效，时间复杂度接近 $O(n)$。
- **稳定性**：插入排序是稳定的。元素是逐个插入到前面的有序序列中，如果遇到相等的元素，会插到它的后面，保持相对顺序不变。
- **在线算法**：可以一边接收数据一边排序，不需要知道数据的总量。
- **原地排序**：空间复杂度为 $O(1)$。
- **简单高效**：在数据量较小（例如少于 20 个元素）时，插入排序通常比快速排序或归并排序更加高效（因为低阶项系数和常数项更小）。

## 算法步骤

1. **初始状态**：从第一个元素开始，该元素可以认为已经被排序。
2. **取出元素**：取出下一个元素，在已经排序的元素序列中从后向前扫描。
3. **比较与移动**：如果该元素（已排序）大于新元素，将该元素移到下一位置。
4. **寻找位置**：重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置。
5. **插入元素**：将新元素插入到该位置后。
6. **重复循环**：重复步骤 2~5。

## 复杂度分析

| 指标          | 描述       |
|-------------|----------|
| **平均时间复杂度** | $O(n^2)$ |
| **最坏时间复杂度** | $O(n^2)$ |
| **最优时间复杂度** | $O(n)$   |
| **空间复杂度**   | $O(1)$   |
| **稳定性**     | 稳定       |

## 应用场景

- **小规模数据集**：由于其简单的逻辑和低开销，对于小规模数据（如 $n < 50$），插入排序往往是最佳选择。这也是为什么高级排序算法（如
  Python 的 Timsort、C++ STL 的 introsort）在递归到底层小数组时会切换为插入排序。
- **基本有序的数据**：如果数据已经预先排序或接近排序完成，插入排序的效率极高。
- **实时系统**：作为一个在线算法，它可以在数据被接收时实时进行排序。

## 如何学习

- **打扑克牌**：这是理解插入排序最好的方式。想象你手里抓牌，每次抓一张新牌，你都会扫描手中已有的排好序的牌，找到正确的位置插进去。
- **关注“空位”**：在代码实现中，通常不是一步步交换，而是把比 key 大的元素整个往后挪一位，腾出一个“空位”，最后把 key
  放进去。这是一种优化技巧。
- **分析极值**：思考当数组已经是升序（最好情况）和数组是降序（最坏情况）时，代码的执行流程有什么不同，从而理解时间复杂度的变化。

## 练习题目

- [147. 对链表进行插入排序](https://leetcode.cn/problems/insertion-sort-list/) - 插入排序在链表上的经典应用。
- [912. 排序数组](https://leetcode.cn/problems/sort-an-array/) - 基础排序练习。

## 代码实现

### C

```c
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
```

### C++

```cpp
void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
```

### Java

```java
public class InsertionSort {
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
}
```

### Python

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
```

### TypeScript

```typescript
export const insertionSort = async (array: number[]) => {
  const arr = [...array]
  const n = arr.length

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j]
      j = j - 1
    }
    arr[j + 1] = key
  }
  return arr
}
```
