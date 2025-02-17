import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { configDialog } from '.'

describe('configDialog', () => {
  beforeEach(() => {
    // 清理 DOM
    document.body.innerHTML = ''
  })

  it('应该能正确创建一个基础的确认弹窗', () => {
    const mountRef = ref(null)
    const options = {
      msg: '这是一个测试消息',
      title: '测试标题',
      configText: '确定',
      cancelText: '取消',
    }

    const configCallback = vi.fn()
    const cancelCallback = vi.fn()

    const destroy = configDialog(options, mountRef, configCallback, cancelCallback)

    expect(destroy).toBeTypeOf('function')
    // 验证弹窗是否被创建
    expect(document.querySelector('.popup-plus')).toBeTruthy()
  })

  it('应该支持字符串作为选项参数', () => {
    const mountRef = ref(null)
    const message = '简单的消息提示'

    const destroy = configDialog(message, mountRef)

    expect(destroy).toBeTypeOf('function')
    // 验证消息是否正确显示
    const content = document.querySelector('.content')
    expect(content?.textContent?.trim()).toBe(message)
  })

  it('应该支持完整的选项配置', () => {
    const mountRef = ref(null)
    const options = {
      msg: '这是一个完整配置的测试',
      isLoading: true,
      confirmAgain: '是否确认执行？',
      configText: '确认执行',
      cancelText: '暂不执行',
      title: '操作确认',
      style: { width: '500px' },
    }

    const destroy = configDialog(options, mountRef)

    expect(destroy).toBeTypeOf('function')
    // 验证标题是否正确显示
    const header = document.querySelector('.header')
    expect(header?.textContent?.trim()).toBe(options.title)
  })

  it('应该正确处理回调函数', async () => {
    const mountRef = ref(null)
    const configCallback = vi.fn()
    const cancelCallback = vi.fn()

    configDialog({
      msg: '测试回调函数',
    }, mountRef, configCallback, cancelCallback)

    // 模拟点击确认按钮
    const confirmBtn = document.querySelector('.btn-view .nut-button:last-child')
    confirmBtn?.dispatchEvent(new Event('click'))

    expect(configCallback).toHaveBeenCalled()
  })
})
