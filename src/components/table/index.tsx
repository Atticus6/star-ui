import type { TableColumnProps as _TableColumnProps, InputNumberProps, InputProps, RadioGroupProps, SelectProps, SliderProps, SwitchProps, TableProps, TreeSelectProps, UploadProps } from 'ant-design-vue'
import type { DatePickerProps, RangePickerProps } from 'ant-design-vue/es/date-picker'

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

const TableCeil = defineComponent({
  name: 'StTableCeil',
  props: {
    opt: {
      required: true,
      type: Object as PropType<any>,
    },
    onEditableChange: {
      required: false,
      type: Function as PropType<(record: any, dataIndex: string) => any>,
    },
  },
  setup({ opt, onEditableChange }) {
    // 单元格内容
    const Children = () => {
      if (!opt.column.customRender) {
        return <div>{opt.record[opt.column.dataIndex]}</div>
      }
      else {
        return <div>{opt.column.customRender(opt)}</div>
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
                onEditableChange(opt.record, opt.column.dataIndex)
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
      type: Object as PropType<Omit<ReturnType<typeof useTable<any, any>>, 'onEditableChange'> & {
        onEditableChange?: any
      } >,
    },
  },
  setup({ table }, ctx) {
    const { api, status, dataSource, onEditableChange, editable = false, getData, ...rest } = table
    const slots = { ...ctx.slots } as Record<string, any>

    onMounted(() => {
      getData()
    })
    if (editable) {
      //  可编辑表格重写表格单元格
      slots.bodyCell = (arg: any) => {
        return <TableCeil opt={arg} onEditableChange={onEditableChange} />
      }
    }
    return () => (
      <a-table {...rest} dataSource={table.dataSource.value} loading={status.value === 'loading'}>
        {slots}
      </a-table>
    )
  },
})

type TableColumnProps<T extends object, E extends boolean = false, C extends ComponentsName = ComponentsName> = Omit<_TableColumnProps<T>, 'dataIndex'> & {
  type?: E extends true ? C : never
  props?: E extends true ? ComponentsList[C] : never
}

type TableColumns<T extends object, E extends boolean = false> = {
  [key in keyof T]: TableColumnProps<UnknowToAny<T>, E>
}
type UseTableProps<T extends object, E extends boolean, R extends any[] > = Omit<TableProps<T>, 'columns' | 'rowKey'> & {
  columns: TableColumns<T, E>
  //  请求数据接口
  api: (...args: R) => Promise<T[]>
  editable?: E
  rowKey: keyof T | ((reocrd: T) => any)
  onEditableChange?: E extends true ? (record: UnknowToAny<T>, dataIndex: keyof T) => any : never
}
export function useTable<T extends object = object, E extends boolean = false, R extends any[] = any[]>(props: UseTableProps<UnknowToAny<T>, E, R>) {
  const dataSource = ref<T[]>([])
  const status = ref<'loading' | 'error' | 'success'>('loading')
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
  } as _TableColumnProps))
  return {
    ...props,
    dataSource,
    columns,
    status,
    getData,
    useLoading,
  }
}

export default Table
