import { describe, expect, it } from 'vitest'

import { Model } from '../../../src'
import { Attr } from '../../../src/decorators'

describe('unit/model/Model_Serialization', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Attr() arr!: []
    @Attr() obj!: Record<string, any>
  }

  it('can serialize the model', () => {
    const user = new User({
      id: 1,
      arr: [1, 2, 3],
      obj: { key: 'value' },
    })

    const expected = {
      id: 1,
      arr: [1, 2, 3],
      obj: { key: 'value' },
    }

    expect(user.$toJson()).toEqual(expected)
  })
})
