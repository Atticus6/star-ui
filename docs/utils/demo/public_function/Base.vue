<script setup lang="ts">
import { public_function } from '@/utils/public_function'
const res = ref()
function fn() {
  res.value =  public_function(1,2)
}
</script>

<template>
  <div>
    <a-button @click="fn">触发public_function</a-button>
    <div>result:{{res}}</div>
  </div>
</template>