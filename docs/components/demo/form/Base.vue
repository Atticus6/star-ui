<script setup lang="ts">
import Form, { useForm } from '@/components/form'

const form = useForm(
  {
    name: 'baseic',
    defaultValues: { name: '', age: '111', password: '111' },
    onFinish(values) {
      console.log(values)
    },
    labelCol: {
      span: 3,
    },
    components: {
      age: {
        type: 'Input',
        label: '年龄',
        props: {
          allowClear: true,
        },
        rules: [{
          required: true,
        }],
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
      a: {
        type: 'Input',
        label: '测试',
        props: {
          allowClear: true,
        },
      },
      password: {
        type: 'InputPassword',
        label: '密码',
        required: true,
        rules: [{
          min: 6,
        }],
        props: {
        },
      },
    },
  },
)
</script>

<template>
  <div>
    <Form :form="form">
      <a-button type="primary" html-type="submit">
        提交
      </a-button>
      <a-button @click="form.resetFields()">
        重置
      </a-button>
    </Form>
    {{ form.formSchema }}
  </div>
</template>
