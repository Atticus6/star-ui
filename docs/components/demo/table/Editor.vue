<script setup lang="tsx">
import Table, { useTable } from '@/components/table'
import { MoneyCollectOutlined } from '@ant-design/icons-vue'

function api() {
  const url = new URL('https://6789ec35dd587da7ac280f91.mockapi.io/goods')
  return fetch(url, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  })
    .then(res => res.json())
}

async function changeById(data: any, id: string) {
  await fetch(`https://6789ec35dd587da7ac280f91.mockapi.io/goods/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

async function create(data: any) {
  await fetch(`https://6789ec35dd587da7ac280f91.mockapi.io/goods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

const table = useTable({
  api,
  bordered: true,
  size: 'large',
  editable: 'modal',
  modalProps: {
    title: '产品编辑',
    okText: '确定',
    cancelText: '取消',
  },
  rowKey: 'id',
  formProps: {
    name: 'modal-form',
    labelCol: { span: 6 },
  },
  // 返回一个Promise
  onEditableChange(data) {
    return changeById(data, data.id)
  },
  // 返回一个Promise
  create,
  columns: {
    id: {
      title: 'ID',
      fixed: 'left',
    },
    name: {
      title: '名称(可编辑)',
      type: 'Input',
      props: {
        allowClear: true,
        placeholder: '请输入名称',
      },
      formItemProps: {
        rules: [
          {
            required: true,
          },
          {
            max: 5,
            message: '最多5个字符',
          },
        ],
      },
    },
    place: {
      title: '产地(可选择)',
      type: 'Select',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      props: {
        class: 'w-full',
        options: [
          {
            label: '上海',
            value: '上海',
          },
          {
            label: '北京',
            value: '北京',
          },
        ],
      },
    },
    amount: {
      title: '数量',
      type: 'InputNumber',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      props: {
        class: 'w-full',
      },
    },
    price: {
      title: '价格',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      customRender({ value }) {
        return (
          <span>
            {value}
            <MoneyCollectOutlined />
          </span>
        )
      },
    },
    total: {
      title: '总价',
      formItemProps: {
        hidden: true,
      },
      customRender({ record }) {
        return (
          <span>
            {(record.amount * record.price).toFixed(2)}
            <MoneyCollectOutlined />
          </span>
        )
      },
    },
    action: {
      title: '操作',
      width: 100,
      formItemProps: {
        hidden: true,
      },
      customRender({ record }) {
        return (
          <a-space>
            <a onClick={() => {
              table.openModal(record)
            }}
            >
              编辑
            </a>
          </a-space>
        )
      },
      fixed: 'right',
    },
  },
  title() {
    return (
      <a-button
        type="primary"
        onClick={() => {
          table.openModal()
        }}
      >
        新建
      </a-button>
    )
  },
})
</script>

<template>
  <div>
    <Table :table="table">
      <template #modal>
        <a-form-item name="other" label="扩展表单项">
          <a-input v-model:value="table.modalDataSource.value.other" />
        </a-form-item>
      </template>
    </Table>
  </div>
</template>
