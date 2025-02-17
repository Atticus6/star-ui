import type { FormItemProps, FormProps, InputNumberProps, InputProps, RadioGroupProps, SelectProps, SliderProps, SwitchProps, TreeSelectProps, UploadProps } from 'ant-design-vue'
import type { DatePickerProps, RangePickerProps } from 'ant-design-vue/es/date-picker'
import type { PropType } from 'vue'
import type { JSX } from 'vue/jsx-runtime'
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

/**
 * 基于Antd的二次封装表单
 *
 * @author wanglt <wanglt@startimes.com.cn>
 * @date 2025-01-06
 */
const Form = defineComponent({
  name: 'StForm',
  props: {
    form: {
      type: Object as PropType<ReturnType<typeof useForm<any, any>>>,
      required: true,
    },
  },
  setup(props, ctx) {
    const { slots } = ctx
    const { formSchema } = props.form
    const { components, defaultValues, ...rest } = props.form.props
    return () => (
      <a-form {...rest} model={formSchema}>
        {Object.entries(components).map(([fieldName, config]) => {
          const { type, props, ...r } = config as FieldComponent
          const Com = componentsList[type] as unknown as keyof typeof componentsList
          const nslots = (props?.slots || {}) as object
          const newSlots: any = {}
          // 将带参函数转为无参函数
          for (const key in nslots) {
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-expect-error
            newSlots[key] = () => nslots[key]({ formSchema })
          }
          return (
            <a-form-item key={fieldName} {...r} name={fieldName}>
              {Com
                ? (
                    <>
                      {type === 'Switch'
                        ? (
                            <Com v-model:checked={formSchema[fieldName]} {...props}>
                              {{ ...newSlots }}
                            </Com>
                          )
                        : (
                            <Com v-model:value={formSchema[fieldName]} {...props}>
                              {{ ...newSlots }}
                            </Com>
                          )}
                    </>
                  )
                : <div>不受支持的组件</div>}
            </a-form-item>
          )
        })}
        <a-form-item>
          {slots.default?.()}
        </a-form-item>
      </a-form>
    )
  },
})

type ComponentsName = keyof ComponentsList
type FormComponents<T extends object = object> = {
  [K in keyof T]: FieldComponent<T>
}

type FormSchema<T extends FormComponents> = {
  [K in keyof T]: any;
}
type UnknowToAny<T extends object> = {
  [K in keyof T]: T[K] extends unknown ? any : T[K]
}
type SlotProps<T extends object> = {} & {
  formSchema: UnknowToAny<T>
}
type FieldComponent<T extends object = object, C extends ComponentsName = ComponentsName> = FormItemProps & {
  type: C
  props?: ComponentsList[C] & {
    slots?: Record<string, ({ formSchema }: SlotProps<T>) => JSX.Element>
  }

}
type UserFormProps<T extends FormComponents, D extends object > = Omit<FormProps, 'onFinish'> & {
  defaultValues: D
  components: T
  onFinish?: (value: Merge<FormSchema<T>, D>) => any
}

type Merge<A extends object, B extends object> = Omit<A, keyof B> & B

export function useForm<T extends object = object, D extends object = FormSchema<T>>(props: UserFormProps<FormComponents<T>, D>) {
  const resetValue = { ...props.defaultValues }
  const formSchema = reactive({ ...resetValue } as Merge<FormSchema<T>, D>)
  const resetFields = () => {
    Object.keys(formSchema).forEach((key) => {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      formSchema[key] = resetValue[key]
    })
  }
  return {
    formSchema,
    props,
    resetFields,
  }
}

export default Form
