import { beforeEach, describe, expect, it } from 'vitest'

import { Attr, Model } from '../../../src'

describe('unit/model/Model_Keys', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('can get primary key value of the model', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
    }

    const userA = new User({ id: 1 })
    expect(userA.$getKey()).toBe(1)

    const userB = new User()
    expect(userB.$getKey()).toBe(null)
  })

  it('can get primary key value of the given record', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
    }

    const user = new User()

    expect(user.$getKey({ id: 1 })).toBe(1)
    expect(user.$getKey({})).toBe(null)
  })

  it('can get composite primary key value of the model', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['idA', 'idB']

      @Attr() idA!: any
      @Attr() idB!: any
    }

    const userA = new User({ idA: 1, idB: 2 })
    expect(userA.$getKey()).toEqual([1, 2])

    const userB = new User({ idA: 1 })
    expect(userB.$getKey()).toEqual(null)
  })

  it('can get composite primary key value of the given record', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['idA', 'idB']

      @Attr() idA!: any
      @Attr() idB!: any
    }

    const user = new User()

    expect(user.$getKey({ idA: 1, idB: 2 })).toEqual([1, 2])
    expect(user.$getKey({ idA: 1 })).toEqual(null)
  })
})
