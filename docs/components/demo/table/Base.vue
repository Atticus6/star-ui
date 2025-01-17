<script setup lang="tsx">
import Table, { useTable } from '@/components/table'
import { MoneyCollectOutlined } from '@ant-design/icons-vue'

function api() {
  return fetch('https://6789ec35dd587da7ac280f91.mockapi.io/goods')
    .then(res => res.json())
}

const table = useTable({
  api,
  bordered: true,
  size: 'large',
  scroll: {
    x: 800,
  },
  editable: true,
  // rowKey: 'id',
  rowKey: record => record.id,
  rowClassName: (record, idx) => {
    return idx % 2 === 0 ? 'a' : 'd'
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
  columns: {
    id: {
      title: 'ID',
      fixed: 'left',
    },
    name: {
      title: '名称',
      width: 160,
      type: 'Input',
      props: {
        allowClear: true,
        placeholder: '请输入名称',
      },
    },
    place: {
      title: '产地',
      width: 160,
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
      width: 160,
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
  },
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
