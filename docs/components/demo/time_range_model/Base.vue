<script setup lang="ts">
import TimeRangeModel from '@/components/time_range_model/index.vue'
import { ref } from 'vue'

const timeRangeData = ref<any>({})
</script>

<template>
  <div>
    <TimeRangeModel
      v-model:start-date="timeRangeData.startDate"
      v-model:end-date="timeRangeData.endDate"
    />
  </div>
  {{ timeRangeData }}
</template>
