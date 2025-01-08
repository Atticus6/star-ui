<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Contributors from './Contributors.vue'

const { isDark } = useData()
const { darkAlgorithm, defaultAlgorithm } = theme

const { Layout } = DefaultTheme
</script>

<template>
  <ConfigProvider :theme="{ algorithm: isDark ? darkAlgorithm : defaultAlgorithm }">
    <Layout>
      <!-- 插槽1 -->
      <template #aside-outline-before>
        <div class="title">
          aside-outline-before
        </div>
      </template>

      <!-- 插槽2 -->
      <template #doc-before>
        <div class="title">
          doc-before
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
</style>
