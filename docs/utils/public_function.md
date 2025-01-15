---
title: public_function
description: 公共函数
author: Jove
contributors:  []
---

# 公共函数

## 目录

1. [数组相关工具函数](#数组相关工具函数)
2. [数值格式化工具函数](#数值格式化工具函数)
3. [对象处理工具函数](#对象处理工具函数)
4. [日期处理工具函数](#日期处理工具函数)
5. [输入验证工具函数](#输入验证工具函数)
6. [高精度计算工具函数](#高精度计算工具函数)
7. [通用工具函数](#通用工具函数)

## 数组相关工具函数

### 1. `arrIsKey`
**描述**：判断数组中是否存在某个对象的特定键值对。

**参数**：
- `arr` (any[])：待检查的数组。
- `key` (string)：对象的键名。
- `value` (string | number)：要匹配的值。

**返回**：
- (boolean)：如果数组中存在匹配项返回 `true`，否则返回 `false`。

**使用示例**：
```js
const arr = [{ id: 1 }, { id: 2 }]
console.log(arrIsKey(arr, 'id', 2)) // 输出: true
```

## 数值格式化工具函数

### 2. `formatPrice`
**描述**：将数值格式化为保留两位小数的字符串。

**参数**：
- `price` (string | number)：需要格式化的价格。

**返回**：
- (string)：格式化后的价格字符串。

**使用示例**：
```js
console.log(formatPrice(123.456)) // 输出: "123.46"
```

### 3. `formatUnitPrice`
**描述**：格式化单价，保留两位或三位小数。

**参数**：
- `value` (number | string)：待格式化的数值。

**返回**：
- (string)：格式化后的单价字符串。

**使用示例**：
```js
console.log(formatUnitPrice(123.456)) // 输出: "123.456"
```

## 对象处理工具函数

### 4. `cleanObject`
**描述**：移除对象中无效的属性，例如空字符串、空数组、NaN 等。

**参数**：
- `obj` (any)：待处理的对象。

**返回**：
- (any)：处理后的新对象。

**使用示例**：
```js
const obj = { a: '', b: null, c: [], d: 123 }
console.log(cleanObject(obj)) // 输出: {d: 123}
```

## 日期处理工具函数

### 5. `addDaysToDate`
**描述**：在指定日期上添加天数并返回新的日期字符串。

**参数**：
- `dateStr` (string)：日期字符串。
- `daysToAdd` (number)：需要添加的天数。

**返回**：
- (string)：新的日期字符串。

**使用示例**：
```js
console.log(addDaysToDate('2025-01-14', 5)) // 输出: "2025-01-19"
```

## 输入验证工具函数

### 6. `validatePrice`
**描述**：验证输入金额是否符合格式要求。

**参数**：
- `rule` (any)：验证规则（可忽略）。
- `price` (string | number)：待验证的金额。

**返回**：
- (Promise)：格式正确返回 `Promise.resolve()`，否则返回 `Promise.reject('输入金额格式不正确')`。

**使用示例**：
```js
validatePrice({}, '123.45').then(() => console.log('格式正确')).catch(err => console.log(err))
```

## 高精度计算工具函数

### 7. `safeSubtraction`
**描述**：解决浮点数减法精度问题。

**参数**：
- `value1` (number | string)：被减数。
- `value2` (number | string)：减数。

**返回**：
- (number | null)：计算结果，如果输入无效返回 `null`。

**使用示例**：
```js
console.log(safeSubtraction(0.3, 0.1)) // 输出: 0.2
```

## 通用工具函数

### 8. `deepClone`
**描述**：深拷贝一个对象。

**参数**：
- `obj` (T)：待拷贝的对象。

**返回**：
- (T)：拷贝后的新对象。

**使用示例**：
```js
const original = { a: 1, b: { c: 2 } }
const copy = deepClone(original)
console.log(copy) // 输出: {a: 1, b: {c: 2}}
```

## 源代码
<<< ../../src/utils/public_function/index.ts
