/* eslint-disable no-console */
import { describe, expect, it } from 'vitest'
import { throttle } from ".";

describe('test throttle', () => {
  it('test throttle 1+2=3', () => {
    const res = throttle(1, 2)
    console.log(res)

    expect(res).toBe(3)
  })
})
