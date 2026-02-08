
希尔排序（Shell Sort）是插入排序的一种更高效的改进版本。希尔排序是非稳定排序算法。该方法因DL.Shell于1959年提出而得名。希尔排序是把记录按下标的一定增量分组，对每组使用直接插入排序算法排序；随着增量逐渐减少，每组包含的关键词越来越多，当增量减至1时，整个文件恰被分成一组，算法便终止。

## 功能特性

- **时间复杂度**：取决于增量序列的选择（Gap Sequence）。最坏情况下维持在 $O(n^2)$，但使用 Hibbard 增量或 Sedgewick 增量可以达到 $O(n^{1.3})$ 甚至更好。
- **不稳定性**：希尔排序是不稳定的。因为相同的元素可能被分到不同的组中进行插入排序，导致相对顺序改变。
- **原地排序**：空间复杂度为 $O(1)$，仅需少量辅助变量。
- **跳跃式移动**：相比插入排序的“一步步挪”，希尔排序允许元素进行大幅度的跨越式移动，从而更快地将小元素移到前面。

## 算法步骤

1. **选择增量**：选择一个增量序列 $t_1, t_2, \dots, t_k$，其中 $t_i > t_{i+1}$，且 $t_k = 1$。
2. **分组排序**：按增量序列个数 $k$，对序列进行 $k$ 趟排序。
3. **插入排序**：每趟排序，根据对应的增量 $t_i$，将待排序列分割成若干长度为 $m$ 的子序列，分别对各子表进行直接插入排序。
4. **结束条件**：仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

## 复杂度分析

| 指标 | 描述 |
| --- | --- |
| **平均时间复杂度** | $O(n \log n)$ 到 $O(n^2)$ |
| **最坏时间复杂度** | $O(n^2)$ |
| **最优时间复杂度** | $O(n)$ |
| **空间复杂度** | $O(1)$ |
| **稳定性** | 不稳定 |

## 应用场景

- **中等规模数据**：在数据量中等（几千到几万）且对稳定性没有要求的场景下，希尔排序的代码极其简单且效率不错。
- **嵌入式系统**：在一些嵌入式系统或老旧的 C 标准库（如 uClibc）中，希尔排序常被用以此替代快排，因为它的递归深度为 0（无栈溢出风险），且代码体积非常小。
- **硬件排序**：由于其非递归和简单的控制流，便于硬件实现。

## 如何学习

- **理解“宏观调控”**：插入排序只能微调（相邻交换），希尔排序可以宏观调控（远距离交换）。前期的大步长分组是为了让数组“大致有序”。
- **回顾插入排序**：希尔排序本质上就是多次插入排序。当 gap=1 时，它就是标准的插入排序。
- **增量序列**：不用死记硬背各种复杂的增量序列，知道最简单的 `gap = gap / 2` 即可，但也需要了解这并不是最高效的。

## 练习题目

- [912. 排序数组](https://leetcode.cn/problems/sort-an-array/) - 可以作为一种实现练习，观察不同 Gap 序列对性能的影响。

## 代码实现

### C

```c
void shellSort(int arr[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}
```

### C++

```cpp
void shellSort(vector<int>& arr) {
    int n = arr.size();
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}
```

### Java

```java
public class ShellSort {
    public static void shellSort(int arr[]) {
        int n = arr.length;
        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i += 1) {
                int temp = arr[i];
                int j;
                for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                    arr[j] = arr[j - gap];
                arr[j] = temp;
            }
        }
    }
}
```

### Python

```python
def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2
    return arr
```

### TypeScript

```typescript
export const shellSort = async (array: number[]) => {
  const arr = [...array];
  const n = arr.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
  return arr;
};
```
