import type { Theme } from 'vitepress'
import { ElementPlusContainer } from '@vitepress-demo-preview/component'
import Antd from 'ant-design-vue'
import DefaultTheme from 'vitepress/theme'

import 'virtual:uno.css'
import 'ant-design-vue/dist/reset.css'
import './glonal.css'
import '@vitepress-demo-preview/component/dist/style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('demo-preview', ElementPlusContainer)
    app.use(Antd)
  },
} satisfies Theme
