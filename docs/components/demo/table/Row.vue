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

async function deleteById(id: string) {
  await fetch(`https://6789ec35dd587da7ac280f91.mockapi.io/goods/${id}`, {
    method: 'DELETE',
  })
}
async function changeById(data: any, id: string) {
  await fetch(`https://6789ec35dd587da7ac280f91.mockapi.io/goods/${id}`, {
    method: 'PUT',
    headers: {
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}
const table = useTable({
  api,
  bordered: true,
  size: 'large',
  editable: 'inRow',
  rowKey: 'id',
  onEditableChange(data) {
    table.useLoading(changeById(data, data.id))
  },
  columns: {
    id: {
      title: 'ID',
      fixed: 'left',
    },
    name: {
      title: '名称(可编辑)',
      type: 'Input',
      width: 160,
      props: {
        allowClear: true,
        placeholder: '请输入名称',
      },
    },
    place: {
      title: '产地(可选择)',
      type: 'Select',
      width: 160,
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
      title: '数量(可输入)',
      type: 'InputNumber',
      width: 200,
      props: {
        class: 'w-full',
      },
    },
    price: {
      title: '价格(可输入)',
      type: 'InputNumber',
      width: 200,
      props: {
        class: 'w-full',
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
      customRender({ record }) {
        return (
          <a-space>
            <a-popconfirm
              title="确定删除吗?"
              onConfirm={async () => {
                await deleteById(record.id)
                table.getData()
              }}
            >
              <a>删除</a>
            </a-popconfirm>
          </a-space>
        )
      },
      fixed: 'right',
    },
  },
})
</script>

<template>
  <div>
    <Table :table="table" />
  </div>
</template>
