import type { TableColumnProps as _TableColumnProps, FormInstance, FormItemProps, FormProps, InputNumberProps, InputProps, ModalProps, RadioGroupProps, SelectProps, SliderProps, SwitchProps, TableProps, TreeSelectProps, UploadProps } from 'ant-design-vue'
import type { DatePickerProps, RangePickerProps } from 'ant-design-vue/es/date-picker'

import type { TableRowSelection } from 'ant-design-vue/es/table/interface'
import type { PropType } from 'vue'
import { DatePicker, Input, InputNumber, InputPassword, RadioGroup, RangePicker, Select, Slider, Switch, TreeSelect, Upload } from 'ant-design-vue'

const componentsList = {
  Input,
  Select,
  InputPassword,
  DatePicker,
  RangePicker,
  InputNumber,
  RadioGroup,
  Slider,
  Switch,
  TreeSelect,
  Upload,
}

interface ComponentsList {
  Input: InputProps
  Select: SelectProps
  InputPassword: ExtractPropTypes<typeof InputPassword>
  InputNumber: InputNumberProps
  DatePicker: DatePickerProps
  RangePicker: RangePickerProps
  RadioGroup: RadioGroupProps
  Slider: SliderProps
  Switch: SwitchProps
  TreeSelect: TreeSelectProps
  Upload: UploadProps
}
type ComponentsName = keyof ComponentsList
type UnknowToAny<T extends object> = {
  [K in keyof T]: T[K] extends unknown ? any : T[K]
}
type WithReocrd<T extends object> = T & Record<string, any>
type Editable = 'inRow' | 'modal' | undefined

const TableCeil = defineComponent({
  name: 'StTableCeil',
  props: {
    opt: {
      required: true,
      type: Object as PropType<any>,
    },
    onEditableChange: {
      required: false,
      type: Function as PropType<(record: any) => any>,
    },
  },
  setup({ opt, onEditableChange }) {
    // 单元格内容
    const Children = () => {
      if (!opt.column.customRender) {
        return <div>{opt.record[opt.column.dataIndex]}</div>
      }
      else {
        return <div>{opt.column.customRender({ ...opt, value: opt.record[opt.column.dataIndex] })}</div>
      }
    }
    if (!opt.column?.type) {
      return () => {
        return <Children />
      }
    }
    const Com = componentsList[(opt.column?.type || 'Input') as ComponentsName]
    const showCom = ref(false)
    const elementRef = useTemplateRef<any>('elementRef')
    let valueChanged = false

    const showComComputed = computed(() => {
      return showCom.value || (!opt.record[opt.column.dataIndex] && opt.record[opt.column.dataIndex] !== 0)
    })

    return () => {
      return (
        <>
          <Com
            v-show={showComComputed.value}
            {...opt.column.props}
            v-model:value={opt.record[opt.column.dataIndex]}
            onBlur={() => {
              showCom.value = false
              if (onEditableChange && valueChanged) {
                onEditableChange(opt.record)
              }
            }}
            onFocus={() => showCom.value = true}
            ref="elementRef"
            onChange={() => {
              valueChanged = true
            }}
          />
          <span
            v-show={!showComComputed.value}
            onClick={() => {
              showCom.value = true
              valueChanged = false
              nextTick(() => {
                if (elementRef.value) {
                  elementRef.value.focus()
                }
              })
            }}
          >
            <Children />
          </span>
        </>
      )
    }
  },
})

/**
 * 基于Antd二次封装的表格
 *
 * @author wanglt <wanglt@startimes.com.cn>
 * @date 2025-01-17
 */
const Table = defineComponent({
  name: 'StTable',
  props: {
    table: {
      required: true,
      type: Object as PropType<Omit<ReturnType<typeof useTable<any, any>>, 'onEditableChange' | 'editable'> & {
        onEditableChange?: any
        editable?: Editable
      } >,
    },
  },
  setup({ table }, ctx) {
    const { api, status, dataSource, onEditableChange, create, editable = undefined, open, modalProps, formProps = {}, rowSelection, modalDataSource, getData, ...rest } = table
    const slots = { ...ctx.slots } as Record<string, any>
    onMounted(() => {
      getData()
    })
    if (editable === 'inRow') {
      //  可编辑表格重写表格单元格
      slots.bodyCell = (arg: any) => {
        return <TableCeil opt={arg} onEditableChange={onEditableChange} />
      }
    }
    const Temp = () => (
      <a-table
        {...rest}
        dataSource={table.dataSource.value}
        loading={status.value === 'loading'}
        rowSelection={rowSelection
          ? {
              ...rowSelection,
              selectedRowKeys: (rowSelection.selectedRowKeys as any).value,
            }
          : undefined}
      >
        {slots}
      </a-table>
    )
    if (editable !== 'modal') {
      // 行内编辑提前返回结果
      return () => <Temp />
    }
    const isCreate = ref(Object.keys(table.modalDataSource?.value || {}).length === 0)
    const modalFormRef = useTemplateRef<FormInstance>('modalFormRef')
    if (open) {
      watch(() => open.value, (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
          isCreate.value = Object.keys(table.modalDataSource?.value || {}).length === 0
        }
      })
    }
    const components = computed(() => {
      return rest.columns.map((item) => {
        const key = item.dataIndex as string
        const formItemProps = item?.formItemProps || {}
        formItemProps.label = formItemProps?.label || item.title
        formItemProps.name = formItemProps?.name || key
        const Com = componentsList[(item.type || 'Input')]
        const comProps = (item.props || {}) as any
        if (key === rest.rowKey) {
          if (isCreate.value) {
            formItemProps.hidden = formItemProps.hidden ?? true
          }
          else {
            comProps.disabled = comProps.disabled ?? true
          }
        }
        return {
          key,
          formItemProps,
          comProps,
          Com,
        }
      })
    })
    return () => (
      <>
        <Temp />
        {editable === 'modal' && open && modalDataSource.value && (
          <a-modal
            {...modalProps}
            v-model:open={open.value}
            confirmLoading={status.value === 'loading'}
            onOk={async () => {
              const res = await modalFormRef.value?.validate().catch((error) => {
                console.log('error', error)
              })
              if (!res) {
                return
              }
              if (isCreate.value) {
                if (create) {
                  await table.useLoading(create(modalDataSource.value))
                }
              }
              else if (onEditableChange) {
                await onEditableChange(res)
              }
              await getData()
              open.value = false
            }}
          >
            <a-form {...formProps} model={modalDataSource.value} ref="modalFormRef">
              {components.value.map((item) => {
                const { Com, comProps } = item
                return (
                  <a-form-item key={item.key} {...item.formItemProps}>
                    <Com {...comProps} v-model:value={modalDataSource.value![item.key]} />
                  </a-form-item>
                )
              })}
              {slots.modal?.()}
            </a-form>
            {JSON.stringify(modalDataSource.value)}
          </a-modal>
        ) }
      </>
    )
  },
})

type TableColumnProps<T extends object, E extends Editable = undefined, C extends ComponentsName = ComponentsName> = Omit<_TableColumnProps<T>, 'dataIndex'> & {
  type?: E extends undefined ? never : C
  props?: E extends undefined ? never : C extends undefined ? InputProps : ComponentsList[C]
  formItemProps?: E extends 'modal' ? FormItemProps : never
}

type TableColumns<T extends object, E extends Editable = undefined> = {
  [key in keyof T]: TableColumnProps<UnknowToAny<T>, E>
}
type RowSelection<T extends object> = Omit<TableRowSelection<UnknowToAny<T>>, 'selectedRowKeys'> | undefined
type UseTableProps<T extends object, E extends Editable, R extends any[], S extends RowSelection<T> > = Omit<TableProps<T>, 'columns' | 'rowKey' | 'rowSelection'> & {
  columns: TableColumns<T, E>
  //  请求数据接口
  api: (...args: R) => Promise<T[]>
  editable?: E
  modalProps?: E extends 'modal' ? ModalProps : never
  formProps?: E extends 'modal' ? FormProps : never
  rowKey: keyof T | ((reocrd: T) => any)
  rowSelection?: S extends undefined ? never : S
  onEditableChange?: E extends undefined ? never : (record: UnknowToAny<T>) => Promise<any>
  create?: E extends 'modal' ? (record: UnknowToAny<T>) => Promise<any> : never
}
export function useTable<T extends object = object, E extends Editable = undefined, R extends any[] = any[], S extends RowSelection<T> = RowSelection<T> >(props: UseTableProps<UnknowToAny<T>, E, R, S>) {
  const dataSource = ref<T[]>([])
  const status = ref<'loading' | 'error' | 'success'>('loading')
  const open = props?.editable === 'modal' ? ref(false) : undefined
  const modalDataSource = ref<WithReocrd<UnknowToAny<T>>>({} as WithReocrd<UnknowToAny<T>>)
  const selectedRowKeys = ref<(string | number)[]>([])
  const _rowSelection = props?.rowSelection
    ? {
        ...props.rowSelection,
        selectedRowKeys,
        onChange(v: (string | number)[], selectedRows: UnknowToAny<T>[]) {
          selectedRowKeys.value = v
          if (props.rowSelection?.onChange) {
            props.rowSelection?.onChange(v, selectedRows)
          }
        },
      }
    : undefined
  const rowSelection = _rowSelection as unknown as S extends undefined ? never : Omit<S, 'selectedRowKeys'> & { selectedRowKeys: typeof selectedRowKeys }
  async function useLoading<T>(p: Promise<T>) {
    status.value = 'loading'
    try {
      return await p
    }
    finally {
      status.value = 'success'
    }
  }
  const getData = async (...args: R) => {
    const res = await useLoading(props.api(...args))
    dataSource.value = res
  }
  const columns = Object.entries(props.columns).map(([dataIndex, value]: any) => ({
    ...value,
    dataIndex,
  } as TableColumnProps<T, E> & {
    dataIndex: keyof T
  }))

  const onEditableChange = (arg: any) => {
    if (props.onEditableChange) {
      return useLoading(props.onEditableChange(arg))
    }
  }

  const openModal = (data?: UnknowToAny<T>) => {
    if (open) {
      open.value = true
      modalDataSource.value = { ...data }
    }
  }
  return {
    ...props,
    dataSource,
    columns,
    status,
    open,
    modalDataSource,
    rowSelection,
    getData,
    useLoading,
    openModal,
    onEditableChange,
  }
}

export default Table
