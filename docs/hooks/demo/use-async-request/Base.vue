<script setup lang="ts">
import { useAsyncRequest } from '@/hooks/use-async-request'

const result = ref<any>()
async function api(id: number) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
  await new Promise(resolve => setTimeout(resolve, 2000))
  result.value = await res.json()
}
const [execute, loading] = useAsyncRequest(api)
</script>

<template>
  <div>
    <a-button
      :loading="loading" @click="() => {
        result = null;
        execute(1);
      }"
    >
      请求
    </a-button>

    <div>结果:{{ result }}</div>
  </div>
</template>
