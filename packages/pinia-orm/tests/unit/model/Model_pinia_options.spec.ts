import { describe, expect, it } from 'vitest'

import { Attr, Model } from '../../../src'

describe('unit/model/Model', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number

    static piniaOptions = {
      persist: true,
    }
  }

  it('uses the pinia options in the store', () => {
    const user = new User({ id: 1, name: 'John Doe' })

    expect(user.$piniaOptions()).toEqual({ persist: true })
  })
})
