import type { PropType } from 'vue'
import { type FormItemProps, type FormProps, Input, InputPassword, type InputProps, Select, type SelectProps } from 'ant-design-vue'

const componentsList = {
  Input,
  Select,
  InputPassword,
}

interface ComponentsList {
  Input: InputProps
  Select: SelectProps
  InputPassword: ExtractPropTypes<typeof InputPassword>
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
      type: Object as PropType<ReturnType<typeof useForm<any>>>,
      required: true,
    },
  },
  // slots: Object as SlotsType<StFormSlots>,
  setup(props, ctx) {
    const { slots } = ctx
    const { data } = props.form
    const { components, defaultValues, ...rest } = props.form.props
    return () => (
      <a-form {...rest} model={data}>

        {Object.entries(components).map(([fieldName, config]) => {
          const { type, props, ...r } = config
          const Com = componentsList[type] as any
          return (
            <a-form-item key={fieldName} {...r} name={fieldName}>
              <Com v-model:value={data[fieldName]} {...props} />
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

type FieldComponent<C extends ComponentsName = ComponentsName> = FormItemProps & {
  type: C
  props?: ComponentsList[C]
}

type FormComponents<T extends object = object> = {
  [K in keyof T]: FieldComponent;
}

type UserFormProps<T extends object > = Omit<FormProps, 'onFinish'> & {
  defaultValues: T
  components: FormComponents<T> & Record<string, FieldComponent>
  onFinish?: (value: T) => any
}

export function useForm<T extends object = object>(props: UserFormProps<T>) {
  const resetValue = { ...props.defaultValues }
  const data = reactive({ ...resetValue })
  const resetFields = () => {
    Object.keys(data).forEach((key) => {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      data[key] = resetValue[key]
    })
  }
  return {
    data,
    props,
    resetFields,
  }
}

export default Form
