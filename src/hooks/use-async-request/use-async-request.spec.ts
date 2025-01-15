import { describe, expect, it } from 'vitest'

import { useAsyncRequest } from '.'

describe('test useAsyncRequest', () => {
  it('should useAsyncRequest the input value', async () => {
    async function api(id: number) {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
      await new Promise(resolve => setTimeout(resolve, 2000))
      return res.json()
    }
    const [execute, loading] = useAsyncRequest(api)
    expect(loading.value).toBe(false)
    execute(1).finally(() => {
      expect(loading.value).toBe(false)
    })
    expect(loading.value).toBe(true)
  })
})
