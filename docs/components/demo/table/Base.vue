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

const table = useTable({
  api,
  bordered: true,
  size: 'large',
  rowKey: 'id',
  //  动态key
  // rowKey: record => record.id,
  rowClassName: (record, idx) => {
    return idx % 2 === 0 ? 'a' : 'd'
  },
  columns: {
    id: {
      title: 'ID',
      fixed: 'left',
    },
    name: {
      title: '名称',
    },
    place: {
      title: '产地',
    },
    amount: {
      title: '数量',
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
