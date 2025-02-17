<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue'

import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Contributors from './Contributors.vue'

const { isDark } = useData()
const { darkAlgorithm, defaultAlgorithm } = theme

const { Layout } = DefaultTheme

function enableTransitions() {
  return 'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )}px at ${x}px ${y}px)`,
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
  )
})
</script>

<template>
  <ConfigProvider :theme="{ algorithm: isDark ? darkAlgorithm : defaultAlgorithm }">
    <Layout>
      <!-- 插槽1 -->
      <template #aside-outline-before>
        <div class="title">
          目录
        </div>
      </template>

      <!-- 插槽2 -->
      <template #doc-before>
        <div class="title">
          star-UI
        </div>
      </template>

      <template #doc-footer-before>
        <Contributors />
      </template>
    </Layout>
  </ConfigProvider>
</template>

<style>
/* .title {
    color: red;
} */

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
