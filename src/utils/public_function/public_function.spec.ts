/* eslint-disable no-console */
import { describe, expect, it } from 'vitest'
import { public_function } from ".";

describe('test public_function', () => {
  it('test public_function 1+2=3', () => {
    const res = public_function(1, 2)
    console.log(res)

    expect(res).toBe(3)
  })
})
