import type { PropType } from 'vue'
import { Button, type ButtonProps, type FormItemProps, type FormProps, Input, InputPassword, type InputProps, Select, type SelectProps } from 'ant-design-vue'

const componentsList = {
  Input,
  Select,
  InputPassword,
  Button,
}

interface ComponentsList {
  Input: InputProps
  Select: SelectProps
  InputPassword: ExtractPropTypes<typeof InputPassword>
  Button: ButtonProps
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
  setup({ form }) {
    const { data } = form
    const { components, defaultValues, ...rest } = form.props
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
          <a-button type="primary" html-type="submit">提交</a-button>
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

export function useForm<T extends Record<string, unknown> = any>(props: UserFormProps<T>) {
  const data = reactive(props.defaultValues)
  return {
    data,
    props,
  }
}

export default Form