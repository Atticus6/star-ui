/**
 * 命令式弹出确认框
 *
 * @function config-dialog
 * @author <jove.qaq@qq.com>
 * @date 2025-02-17
 */

import { createApp, defineComponent, h } from 'vue'
import config from './config.vue'

interface Options {
  msg: string // 提示信息
  isLoading?: boolean // 是否显示loading
  confirmAgain?: string // 是否再次确认
  configText?: string // 确认按钮文字
  cancelText?: string // 取消按钮文字
  title?: string // 弹窗标题
  style?: any // 自定义样式
}

/**
 * @description 生成一个确认弹窗，支持异步加载状态和二次确认功能
 * @param {Options | string} options - 弹窗配置对象，或者直接传入字符串作为 `msg` 提示信息
 *   @property {string} msg - 必填，弹窗提示信息
 *   @property {boolean} [isLoading=false] - 选填，点击确认后按钮是否进入 loading 状态，isLoading开启时，必须根据return主动关闭弹窗
 *   @property {string} [confirmAgain=false] - 选填，是否需要二次确认，默认 false
 *   @property {string} [configText='确定'] - 选填，确认按钮文字，默认“确定”
 *   @property {string} [cancelText='取消'] - 选填，取消按钮文字，默认“取消”
 *   @property {string} [title=false] - 选填，弹窗标题，默认不显示标题
 *   @property {any} [style] - 选填，自定义弹窗样式
 * @param {any} mountRef - 需要挂载弹窗的目标 `ref`（需传入一个 `ref` 对象）
 * @param {Function} [configCallback] - 选填，点击“确认”按钮时执行的回调函数
 * @param {Function} [cancelCallback] - 选填，点击“取消”按钮时执行的回调函数
 * @returns {Function} - 返回一个 `destroy` 方法，可手动调用以销毁弹窗
 */
export function configDialog(
  options: Options | string,
  mountRef: any, // 传入的 ref 对象
  configCallback?: Function,
  cancelCallback?: Function,
) {
  const popupApp = createApp(
    defineComponent({
      render() {
        return h(config, {
          options,
          configCallback,
          cancelCallback,
          destroy: this.destroy,
        })
      },
      methods: {
        destroy() {
          destroyApp()
        },
      },
    }),
  )

  const systemInfo = uni.getSystemInfoSync()
  if (systemInfo.uniPlatform === 'web') {
    const div = document.createElement('div')
    document.body.appendChild(div)
    popupApp.mount(div)
  }
  else {
    popupApp.mount(mountRef.value)
  }

  // 销毁实例
  const destroyApp = () => {
    popupApp.unmount()
  }

  return destroyApp
}
