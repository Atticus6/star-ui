<script setup lang="ts">
import { useData } from 'vitepress'
import allContributors from '../../../../contributors.json'

const { frontmatter } = useData()

const contributors = computed(() => {
  const contributorsNames = [frontmatter.value?.author, ...frontmatter.value.contributors || []].filter(x => x)
  const res = allContributors.filter(item => contributorsNames.includes(item.name))
  return res
})
</script>

<template>
  <h1 v-if="contributors.length !== 0" class="text-2xl font-medium">
    贡献者
  </h1>
  <div class="flex gap-2">
    <div v-for="(item) in contributors" :key="item.name" class="flex items-center gap-1">
      <img class="w-8 h-8 rounded-full" :src="item.avatar" :alt="item.name">
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>
