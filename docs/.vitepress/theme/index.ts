import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import 'virtual:uno.css'

import 'ant-design-vue/dist/reset.css'

export default {
  ...DefaultTheme,
  enhanceApp(_app) {

  },
} satisfies Theme
