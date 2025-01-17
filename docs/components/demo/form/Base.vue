<script setup lang="tsx">
import Form, { useForm } from '@/components/form'

const form = useForm(
  {
    name: 'baseic',
    defaultValues: { name: '', age: 18, password: '111', progress: 30 },
    onFinish(values) {
      console.log(values)
    },
    labelCol: {
      span: 3,
    },
    components: {
      age: {
        type: 'InputNumber',
        label: '年龄',
        props: {
          allowClear: true,
          // css 横向撑满
          class: 'w-full',
          slots: {
            // prefix插槽
            prefix: () => (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ),
          },
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
      birth: {
        type: 'DatePicker',
        label: '生日',
        props: {
          allowClear: true,
          // css 横向撑满
          class: 'w-full',
        },
      },
      vacation: {
        type: 'RangePicker',
        label: '请假时间',
        props: {
          // css 横向撑满
          class: 'w-full',
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
      open: {
        type: 'RadioGroup',
        label: '是否公开',
        props: {
          options: [
            { label: '公开', value: true },
            { label: '不公开', value: false },
          ],
        },
      },
      tree: {
        type: 'TreeSelect',
        label: '树形选择',
        props: {
          treeData: [
            {
              title: 'parent 1',
              value: '0-0',
              key: '0-0',
              children: [
                {
                  title: 'parent 1-0',
                  value: '0-0-0',
                  key: '0-0-0',
                  children: [
                    {
                      title: 'leaf 1-0-0',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      progress: {
        type: 'Slider',
        label: '进度条',
      },
      switch: {
        type: 'Switch',
        label: '开关',
      },
      file: {
        type: 'Upload',
        label: '上传',
        props: {
          slots: {
            default: () => {
              return (
                <a-button>
                  Upload
                </a-button>
              )
            },
          },
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
