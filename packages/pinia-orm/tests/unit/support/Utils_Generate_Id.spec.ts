import { describe, expect, it } from 'vitest'

import { generateId } from '../../../src/support/Utils'

describe('unit/support/Utils_Generate_Id', () => {
  it('can generate uids', () => {
    const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
    const id1 = generateId(20, urlAlphabet)
    const id2 = generateId(20, urlAlphabet)
    expect(id1).not.toEqual(id2)
  })
})
