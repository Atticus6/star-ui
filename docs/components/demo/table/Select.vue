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
  rowSelection: {
    onChange(v) {
      console.log(v)
    },
    selections: [
      'SELECTION_ALL',
      'SELECTION_INVERT',
      'SELECTION_NONE',
    ],
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

})

const { selectedRowKeys } = table.rowSelection

onMounted(() => {
  selectedRowKeys.value = ['5']
})
</script>

<template>
  <div>
    <Table :table="table">
      <template #title>
        <div v-show="selectedRowKeys.length !== 0">
          <a-button>删除全部</a-button>
        </div>
      </template>
    </Table>
    {{ selectedRowKeys }}
  </div>
</template>
