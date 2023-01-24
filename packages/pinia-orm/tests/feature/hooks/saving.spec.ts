import { describe, expect, it, vi } from 'vitest'

import type { Element } from '../../../src'
import { BelongsTo as BelongsToClass, Model, useRepo } from '../../../src'
import { Attr, BelongsTo, Num, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/hooks/saving', () => {
  it('does nothing when passing in an empty array', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static saving(model: Model) {
        model.name = 'John'
      }
    }

    const savingMethod = vi.spyOn(User, 'saving')

    useRepo(User).save([])

    expect(savingMethod).toBeCalledTimes(0)

    assertState({})
  })

  it('is able to change values', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) declare id: number
      @Attr() declare postId: number | null
      @Str('') declare name: string
      @Num(0) declare age: number
      @BelongsTo(() => Post, 'postId') declare post: User | null

      static saving(model: Model, record?: Element) {
        model.name = 'John'
        const fields = model.$fields()
        for (const name in fields) {
          if (fields[name] instanceof BelongsToClass && record && record[name] === null)
            model[(fields[name] as BelongsToClass).foreignKey] = null
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: number
      @Str('') title!: string
    }

    const savingMethod = vi.spyOn(User, 'saving')

    useRepo(User).save({ id: 1, name: 'John Doe', age: 30, post: { id: 1, title: 'News' } })

    expect(savingMethod).toHaveBeenCalledOnce()

    assertState({
      users: {
        1: { id: 1, name: 'John', age: 30, postId: 1 },
      },
      posts: {
        1: { id: 1, title: 'News' },
      },
    })

    useRepo(User).save({ id: 1, name: 'John Doe', age: 30, post: null })

    assertState({
      users: {
        1: { id: 1, name: 'John', age: 30, postId: null },
      },
      posts: {
        1: { id: 1, title: 'News' },
      },
    })
  })

  it('is stopping record to be saved', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static saving(model: Model) {
        model.name = 'John'
        return false
      }
    }

    const savingMethod = vi.spyOn(User, 'saving')

    useRepo(User).save({ id: 1, name: 'John Doe', age: 30 })

    expect(savingMethod).toHaveBeenCalledOnce()

    assertState({
      users: {},
    })
  })

  it('is stopping record to be saved with new method', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() declare id: string
      @Str('') declare name: string
      @Num(0) declare age: number

      static saving(model: Model) {
        model.name = 'John'
        return false
      }
    }

    mockUid(['uid1'])

    const savingMethod = vi.spyOn(User, 'saving')

    useRepo(User).new()

    expect(savingMethod).toHaveBeenCalledOnce()

    assertState({})
  })
})
