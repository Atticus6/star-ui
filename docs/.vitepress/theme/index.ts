import type { Theme } from 'vitepress'
import Antd from 'ant-design-vue'
import DefaultTheme from 'vitepress/theme'

import 'virtual:uno.css'
import 'ant-design-vue/dist/reset.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(Antd)
  },
} satisfies Theme
