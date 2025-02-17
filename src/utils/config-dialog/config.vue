<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { configDialog } from './index'
import popupPlus from './popup-plus.vue'

const popupStyle = {
  width: '400px',
}

interface Options {
  msg: string // 提示信息
  isLoading?: boolean // 是否显示loading
  confirmAgain?: string // 是否再次确认
  configText?: string // 确认按钮文字
  cancelText?: string // 取消按钮文字
  title?: string // 弹窗标题
  style?: any // 自定义样式
}

export default defineComponent({
  components: {
    PopupPlus: popupPlus,
  },
  props: {
    options: {
      type: [Object, String],
      required: true,
      validator(value: any) {
        if (typeof value === 'string')
          return true
        if (typeof value === 'object' && value?.msg)
          return true
        return false
      },
    },
    configCallback: {
      type: Function,
      default: () => {},
    },
    cancelCallback: {
      type: Function,
      default: () => {},
    },
    destroy: {
      type: Function,
      required: true, // 销毁函数
    },
  },
  setup(props) {
    const loading = ref<boolean>(false)
    const isShow = ref<boolean>(true)
    const confirmAgainRef = ref<any>(null)

    const options = computed<Options>(() => {
      // 如果传入的是字符串，封装为对象并添加默认值
      if (typeof props.options === 'string') {
        return {
          msg: props.options,
          isLoading: false,
          confirmAgain: '',
          configText: '确定',
          cancelText: '取消',
          title: '',
          style: popupStyle,
        }
      }
      return {
        msg: props.options.msg || '',
        isLoading: props.options.isLoading ?? false,
        confirmAgain: props.options.confirmAgain ?? '',
        configText: props.options.configText ?? '确定',
        cancelText: props.options.cancelText ?? '取消',
        title: props.options.title ?? '',
        style: props.options.style ?? popupStyle,
      }
    })

    const cancel = () => {
      props.cancelCallback && props.cancelCallback()
      closePopup()
    }

    const handleConfirm = () => {
      if (options.value.confirmAgain) {
        configDialog(
          {
            msg: options.value.confirmAgain,
            style: {
              width: '300px',
              padding: '10px',
            },
          },
          executeConfirmAction,
        )
        return
      }
      executeConfirmAction()
    }

    const executeConfirmAction = () => {
      if (options.value.isLoading) {
        loading.value = true
        props.configCallback && props.configCallback()
      }
      else {
        props.configCallback && props.configCallback()
        closePopup()
      }
    }

    const closePopup = () => {
      isShow.value = false
      props.destroy()
    }

    return {
      loading,
      isShow,
      options,
      confirmAgainRef,
      cancel,
      handleConfirm,
    }
  },
})
</script>

<template>
  <PopupPlus :is-show="isShow" :popup-style="options.style">
    <view v-if="options.title" class="header">
      {{ options.title }}
    </view>
    <view class="content">
      {{ options.msg }}
    </view>
    <view class="bottom">
      <view class="btn-view" style="width: 70%">
        <nut-button type="primary" shape="square" @click="cancel">
          {{ options.cancelText }}
        </nut-button>
        <nut-button
          type="default"
          shape="square"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ options.configText }}
        </nut-button>
      </view>
    </view>
    <view ref="confirmAgainRef" />
  </PopupPlus>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  white-space: pre-line;
}
.content {
  padding: 20px 10px 30px 10px;
  text-align: center;
  font-size: 18px;
  white-space: pre-line;
}
</style>
