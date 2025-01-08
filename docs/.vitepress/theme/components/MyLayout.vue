<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Contributors from './Contributors.vue'

const { Layout } = DefaultTheme
</script>

<template>
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
</template>

<style>
/* .title {
    color: red;
} */
</style>
