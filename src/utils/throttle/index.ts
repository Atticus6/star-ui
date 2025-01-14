/**
 * 节流点击事件处理器
 * @param delay 节流时间（毫秒）
 * 排除包含 no-throttle 属性的元素
 */
export function initGlobalThrottleClick(delay: number = 1000) {
  const throttledClickHandler = (event: Event) => {
    const target = event.target as HTMLElement

    // 排除当前元素或其父元素包含 no-throttle 属性的元素
    if (hasNoThrottleAttribute(target)) {
      return
    }

    // 仅当点击的元素或其父元素是按钮时才启用节流
    if (!isButtonOrParentButton(target)) {
      return // 如果不是按钮或父级不是按钮，直接跳过节流
    }

    // 节流控制
    const isButtonThrottled = target.dataset.throttled === 'true'
    if (isButtonThrottled) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }

    target.dataset.throttled = 'true' // 开启节流

    // 指定时间后解除节流状态
    setTimeout(() => {
      target.dataset.throttled = 'false'
    }, delay)
  }

  // 在捕获阶段全局监听 click 事件
  document.addEventListener('click', throttledClickHandler, true)
}

/**
 * 判断元素和直接父级是否为按钮
 * @param element 当前点击的元素
 */
function isButtonOrParentButton(element: HTMLElement | null): boolean {
  // 如果目标元素本身是按钮，或者它的父元素是按钮，则返回 true
  return (
    element?.tagName === 'BUTTON'
    || element?.parentElement?.tagName === 'BUTTON'
  )
}

/**
 * 判断元素或其父元素是否包含 no-throttle 属性
 * @param element 当前点击的元素
 * @returns 是否包含 no-throttle 属性
 */
function hasNoThrottleAttribute(element: HTMLElement | null): boolean {
  if (!element)
    return true
  // 判断当前元素或其父元素是否包含 no-throttle 属性
  return (
    element.hasAttribute('no-throttle')
    || element.parentElement?.hasAttribute('no-throttle')
    || false
  )
}
