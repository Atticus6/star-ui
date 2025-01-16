import type { Theme } from 'vitepress'
import { ElementPlusContainer } from '@vitepress-demo-preview/component'
import Antd from 'ant-design-vue'
import mediumZoom from 'medium-zoom'
import { NProgress } from 'nprogress-v2/dist/index.js' // 进度条组件
import { inBrowser, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, onMounted, watch } from 'vue'
import ArticleMetadata from './components/ArticleMetadata.vue'
import MyLayout from './components/MyLayout.vue'

import 'virtual:uno.css'
import 'ant-design-vue/dist/reset.css'
import './glonal.css'
import '@vitepress-demo-preview/component/dist/style.css'
import 'nprogress-v2/dist/index.css' // 进度条样式
import 'virtual:group-icons.css' // 代码组样式

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app, router }) {
    app.component('demo-preview', ElementPlusContainer)
    app.component('ArticleMetadata', ArticleMetadata)
    app.use(Antd)

    if (inBrowser) {
      NProgress.configure({ showSpinner: false })
      router.onBeforeRouteChange = () => {
        NProgress.start() // 开始进度条
      }
      router.onAfterRouteChanged = () => {
        NProgress.done() // 停止进度条
      }
    }
  },
  setup() {
    const route = useRoute()

    const initZoom = () => {
      mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' })
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' }) // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom()),
    )
  },
} satisfies Theme
