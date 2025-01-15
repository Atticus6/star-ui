import { ref } from 'vue'

type AsyncFunction<Params extends any[], Result> = (
  ...args: Params
) => Promise<Result>

/**
 *
 *
 * @function useAsyncRequest
 * @author <wanglt@startimes.com.cn>
 * @date 2025-01-15
 */
export function useAsyncRequest<Params extends any[], Result>(
  asyncFunction: AsyncFunction<Params, Result>,
) {
  const loading = ref(false)

  const execute = async (...args: Params): Promise<Result> => {
    loading.value = true
    return asyncFunction(...args).finally(() => {
      loading.value = false
    })
  }

  return [execute, loading] as const
}
