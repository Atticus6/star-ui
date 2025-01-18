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
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

async function deleteById(id: string) {
  await fetch(`https://6789ec35dd587da7ac280f91.mockapi.io/goods/${id}`, {
    method: 'DELETE',
  })
}

const table = useTable({
  api,
  bordered: true,
  size: 'large',
  editable: true,
  // rowKey: 'id',
  rowKey: record => record.id,
  onEditableChange(record, dataIndex) {
    table.useLoading(changeById({
      [dataIndex]: record[dataIndex],
    }, record.id))
  },
  rowClassName: (record, idx) => {
    return idx % 2 === 0 ? 'a' : 'd'
  },
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
    },
    place: {
      title: '产地(可选择)',
      type: 'Select',
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
      props: {
        class: 'w-full',
      },
    },
    price: {
      title: '价格',

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
      width: 80,
      customRender({ record }) {
        return (
          <div>
            <a-popconfirm
              title="确定删除吗?"
              onConfirm={async () => {
                await deleteById(record.id)
                table.getData()
              }}
            >
              <a>删除</a>
            </a-popconfirm>
          </div>
        )
      },
      fixed: 'right',
    },
  },
  // title插槽
  // title: (record) => {
  //   return (
  //     <div>
  //       title
  //     </div>
  //   )
  // },
  // footer插槽
  // footer: (record) => {
  //   return (
  //     <div>
  //       footer
  //     </div>
  //   )
  // },
})
</script>

<template>
  <div>
    <Table :table="table">
      <template #title>
        title
      </template>
      <template #summary>
        总结栏
      </template>
    </Table>
    {{ table.columns }}
  </div>
</template>

<style scoped lang="scss">
::v-deep(.a) {
  color: red;
}
::v-deep(.d) {
  color: blue;
}
</style>
