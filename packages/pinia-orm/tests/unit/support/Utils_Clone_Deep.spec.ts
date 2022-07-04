import { describe, it, expect } from 'vitest'

import { cloneDeep } from '../../../src/support/Utils'

describe('unit/support/Utils_Clone_Deep', () => {
  it('can create a deep clone of an object', () => {
    const data = {
      id: 1,
      nested: [
        {
          id: 1,
          deep: [
            { id: 1, deeper: { id: 2 } },
            { id: 2, deeper: { id: 3 } },
          ],
        },
      ],
    }

    const clone = cloneDeep(data)

    expect(clone).toStrictEqual(data)

    data.nested[0].deep[0].deeper.id = 4

    expect(clone).not.toStrictEqual(data)
  })
})
