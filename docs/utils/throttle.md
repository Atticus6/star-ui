---
title: throttle
description: 全局节流
author: Jove
contributors:  [wanglt]
---

# 全局节流

## initGlobalThrottleClick
全局节流点击事件处理器。通过配置节流时间，仅对按钮元素或其父元素是按钮的点击事件进行节流处理，并排除包含 `no-throttle` 属性的元素。

## 参数

### `delay`
- 类型：`number`
- 默认值：`1000`
- 说明：节流时间，单位为毫秒，指定同一按钮再次被点击前需要的最短时间间隔。

## 使用方法

在全局约束点击事件，配合节流功能，仅对按钮元素的点击事件生效，并排除包含 `no-throttle` 属性的元素。

```typescript
initGlobalThrottleClick(1000)
```

## 方法详细

### `initGlobalThrottleClick`
通过使用 `setTimeout` 实现节流功能，实时监听对按钮元素的点击，阻止在设定时间内重复执行。

### `isButtonOrParentButton`
判断点击元素或其父元素是否为按钮。

#### 参数
- `element`：`HTMLElement | null`，当前点击的元素。

#### 返回值
- `boolean`：如果点击元素或其父元素是按钮，返回 `true`，否则返回 `false`。

### `hasNoThrottleAttribute`
判断点击元素或其父元素是否包含 `no-throttle` 属性。

#### 参数
- `element`：`HTMLElement | null`，当前点击的元素。

#### 返回值
- `boolean`：如果包含 `no-throttle` 属性，返回 `true`，否则返回 `false`。

## 源代码
::: code-group
<<< ../../src/utils/throttle/index.ts
:::
