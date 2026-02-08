
基数排序（Radix Sort）属于"分配式排序"（Distribution Sort），又称"桶子法"（Bucket Sort或Bin Sort）。顾名思义，它是透过键值的部份资讯，将要排序的元素分配至某些"桶"中，以达到排序的作用，基数排序属于稳定排序。

## 功能特性

- **非比较排序**：基数排序不通过比较两个数的大小来排序，而是通过分配和收集。这使得它突破了基于比较排序的 $O(n \log n)$ 下界。
- **稳定性**：基数排序是稳定的，这是必须的。因为下一轮排序（更高位）必须保留上一轮排序（更低位）的相对顺序，否则结果会出错。
- **空间换时间**：需要额外的空间来创建“桶”，空间复杂度 $O(n+k)$。
- **特定数据类型**：通常用于整数或定长字符串排序，浮点数需要特殊处理。

## 算法原理

1. **统一格式**：将所有待比较数值（正整数）统一为同样的数位长度，数位较短的数前面补零。
2. **分配（Distribute）**：从最低位（个位）开始，根据该位上的数字（0-9），将元素放入对应的 10 个桶中。
3. **收集（Collect）**：按照桶的顺序（0 到 9），依次将元素取出，组成新的序列。
4. **循环**：依次对十位、百位...进行分配和收集，直到最高位排序完成，数列就变成一个有序序列。

## 复杂度分析

| 指标 | 描述 |
| --- | --- |
| **平均时间复杂度** | $O(d \times (n+k))$ |
| **最坏时间复杂度** | $O(d \times (n+k))$ |
| **最优时间复杂度** | $O(d \times (n+k))$ |
| **空间复杂度** | $O(n+k)$ |
| **稳定性** | 稳定 |

其中，$d$ 为最大数的位数（或循环的轮数），$k$ 为桶的个数（通常为 10）。

## 应用场景

- **电话号码排序**：例如对大量手机号码进行排序，因为手机号位数固定（11位），$d$ 很小，效率非常高。
- **字符串排序**：Suffix Array 构造算法（如 DC3 算法）中常使用基数排序作为子程序。
- **特定范围整数**：当数值范围确定（如 0-100000）且数据量极大时，基数排序比快排更快。

## 如何学习

- **理解“桶”**：想象有 10 个标号 0-9 的真实水桶。
- **手动模拟**：写几个三位数，比如 `[329, 457, 657, 839, 436, 720, 355]`。
    - 第一轮看个位：`720` 进 0 号桶，`355` 进 5 号桶...
    - 收集起来。
    - 第二轮看十位...
    - 第三轮看百位...
    - 惊奇地发现排好序了！
- **思考稳定性**：为什么必须从低位先开始排？（LSD, Least Significant Digit first）。如果先从高位排（MSD），对下一位排序时要在每一个桶内部单独排，那是另一种递归逻辑。LSD 必须依赖稳定性。

## 练习题目

- [164. 最大间距](https://leetcode.cn/problems/maximum-gap/) - 题目要求线性时间复杂度，基数排序（或桶排序）是唯一解法。
- [912. 排序数组](https://leetcode.cn/problems/sort-an-array/) - 基数排序通过该题的效率非常高，通常优于快排。

## 代码实现

### C

```c
int getMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max)
            max = arr[i];
    return max;
}

void countSort(int arr[], int n, int exp) {
    int output[n];
    int i, count[10] = {0};

    for (i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];

    for (i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    for (i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}
```

### C++

```cpp
int getMax(vector<int>& arr, int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max)
            max = arr[i];
    return max;
}

void countSort(vector<int>& arr, int n, int exp) {
    vector<int> output(n);
    int i, count[10] = {0};

    for (i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];

    for (i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    for (i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(vector<int>& arr) {
    int n = arr.size();
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}
```

### Java

```java
import java.util.Arrays;

public class RadixSort {
    static int getMax(int arr[], int n) {
        int max = arr[0];
        for (int i = 1; i < n; i++)
            if (arr[i] > max)
                max = arr[i];
        return max;
    }

    static void countSort(int arr[], int n, int exp) {
        int output[] = new int[n];
        int count[] = new int[10];
        Arrays.fill(count, 0);

        for (int i = 0; i < n; i++)
            count[(arr[i] / exp) % 10]++;

        for (int i = 1; i < 10; i++)
            count[i] += count[i - 1];

        for (int i = n - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }

        for (int i = 0; i < n; i++)
            arr[i] = output[i];
    }

    static void radixSort(int arr[], int n) {
        int m = getMax(arr, n);
        for (int exp = 1; m / exp > 0; exp *= 10)
            countSort(arr, n, exp);
    }
}
```

### Python

```python
def counting_sort(arr, exp1):
    n = len(arr)
    output = [0] * (n)
    count = [0] * (10)

    for i in range(0, n):
        index = (arr[i] // exp1)
        count[index % 10] += 1

    for i in range(1, 10):
        count[i] += count[i - 1]

    i = n - 1
    while i >= 0:
        index = (arr[i] // exp1)
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1

    for i in range(0, n):
        arr[i] = output[i]

def radix_sort(arr):
    max1 = max(arr)
    exp = 1
    while max1 // exp > 0:
        counting_sort(arr, exp)
        exp *= 10
    return arr
```

### TypeScript

```typescript
export const radixSort = async (array: number[]) => {
  const arr = [...array];
  const getMax = (arr: number[]) => {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) max = arr[i];
    }
    return max;
  };

  const countSort = (exp: number) => {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = n - 1; i >= 0; i--) {
      output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
      count[Math.floor(arr[i] / exp) % 10]--;
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }
  };

  const m = getMax(arr);
  for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
    countSort(exp);
  }
  return arr;
};
```
