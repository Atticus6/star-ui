<script lang="ts">
import type { Moment } from 'moment'
import { CaretDownFilled } from '@ant-design/icons-vue'
import moment from 'moment'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: { CaretDownFilled },
  props: {
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    startProp: {
      type: String,
      default: 'startDate',
    },
    endProp: {
      type: String,
      default: 'endDate',
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    label: {
      type: String,
      default: '创建时间',
    },
  },
  emits: ['update:startDate', 'update:endDate'],
  setup(props, { emit }) {
    const computedStartDate = computed({
      get: () => props.startDate,
      set: (value: string) => {
        emit('update:startDate', value)
      },
    })
    const computedEndDate = computed({
      get: () => props.endDate,
      set: (value: string) => {
        emit('update:endDate', value)
      },
    })

    const disabledStartDate = (startValue: Moment) => {
      if (!startValue || !computedEndDate.value) {
        return false
      }
      const endMoment = moment(computedEndDate.value, props.format)
      return startValue.valueOf() > endMoment.endOf('day').valueOf()
    }
    const disabledEndDate = (endValue: Moment) => {
      if (!endValue || !computedStartDate.value) {
        return false
      }
      const startMoment = moment(computedStartDate.value, props.format)
      return endValue.valueOf() < startMoment.startOf('day').valueOf()
    }

    return {
      props,
      computedStartDate,
      computedEndDate,
      disabledStartDate,
      disabledEndDate,
    }
  },
})
</script>

<template>
  <view class="time-range">
    <a-form-item
      :label="props.label"
      :name="props.startProp"
      class="time-select"
    >
      <a-date-picker
        v-model:value="computedStartDate"
        :value-format="props.format"
        :format="props.format"
        placeholder="请选择起始日期"
        :disabled-date="disabledStartDate"
      >
        <template #suffixIcon>
          <CaretDownFilled />
        </template>
      </a-date-picker>
    </a-form-item>
    <test class="content-text">
      到
    </test>
    <a-form-item :name="props.endProp" class="time-select">
      <a-date-picker
        v-model:value="computedEndDate"
        :value-format="props.format"
        :format="props.format"
        placeholder="请选择结束日期"
        :disabled-date="disabledEndDate"
      >
        <template #suffixIcon>
          <CaretDownFilled />
        </template>
      </a-date-picker>
    </a-form-item>
  </view>
</template>

<style lang="scss" scoped>
.time-range {
  display: flex;
}
.content-text {
  display: block;
  padding: 0 10px;
  line-height: 30px;
}
</style>
