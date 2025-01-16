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
      type: Object as PropType<ReturnType<typeof useForm<any, any>>>,
      required: true,
    },
  },
  // slots: Object as SlotsType<StFormSlots>,
  setup(props, ctx) {
    const { slots } = ctx
    const { formSchema } = props.form
    const { components, defaultValues, ...rest } = props.form.props
    return () => (
      <a-form {...rest} model={formSchema}>
        {Object.entries(components).map(([fieldName, config]) => {
          const { type, props, ...r } = config as FieldComponent
          const Com = componentsList[type] as unknown as keyof typeof componentsList
          return (
            <a-form-item key={fieldName} {...r} name={fieldName}>
              {Com ? <Com v-model:value={formSchema[fieldName]} {...props} /> : <div>不受支持的组件</div>}
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

type FormSchema<T extends FormComponents> = {
  [K in keyof T]: any;
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
