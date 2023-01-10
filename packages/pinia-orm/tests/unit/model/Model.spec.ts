import { describe, expect, it } from 'vitest'

import { Model } from '../../../src'
import { Attr } from '../../../src/decorators'

describe('unit/model/Model', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() declare id: number
    @Attr() declare lastName: string
  }

  it('ignores unkown field when filling the model', () => {
    const user = new User({ id: 1, name: 'John Doe' })

    expect(user.id).toBe(1)
    expect((user as any).name).toBe(undefined)
  })

  it('can fill fields with the given record by the `$fill` method', () => {
    const userA = new User().$fill({ id: 1 })
    expect(userA.id).toBe(1)

    const userB = new User({ id: 1 }).$fill({})
    expect(userB.id).toBe(1)
  })

  it('can refresh to its original state', () => {
    const user = new User({ id: 1, lastName: 'John Doe' })
    expect(user.$getOriginal()).toMatchObject(user.$getAttributes())
    expect(user.$isDirty()).toBeFalsy()

    user.lastName = 'Johnny Doe'
    expect(user.$isDirty()).toBeTruthy()
    expect(user.$isDirty('lastName')).toBeTruthy()
    expect(user.$isDirty('id')).toBeFalsy()
    user.$refresh()
    expect(user.$isDirty()).toBeFalsy()
    expect(() => user.$isDirty('name')).toThrowError()
  })
})
