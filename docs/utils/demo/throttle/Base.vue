<script setup lang="ts">
import { throttle } from '@/utils/throttle'
const res = ref()
function fn() {
  res.value =  throttle(1,2)
}
</script>

<template>
  <div>
    <a-button @click="fn">触发throttle</a-button>
    <div>result:{{res}}</div>
  </div>
</template>