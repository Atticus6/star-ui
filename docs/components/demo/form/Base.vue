<script setup lang="ts">
import Form, { useForm } from '@/components/form'

const form = useForm(
  {
    name: 'baseic',
    defaultValues: { name: '', age: '111', password: '' },
    onFinish(values) {
      console.log(values)
    },
    components: {
      age: {
        type: 'Input',
        label: '年龄',
        props: {
          allowClear: true,
        },
      },
      name: {
        label: '名称',
        type: 'Select',
        props: {
          allowClear: true,
          options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
          ],
        },
      },
      password: {
        type: 'InputPassword',
        label: '密码',
        props: {
        },
      },
    },
  },
)
</script>

<template>
  <div>
    <Form :form="form" />
    {{ form.data }}
  </div>
</template>
