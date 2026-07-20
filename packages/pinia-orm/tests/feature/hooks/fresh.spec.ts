import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/hooks/fresh', () => {
  it('fires the saving/creating and saved/created hooks', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
      @Str('') name!: string
    }

    const savingMethod = vi.spyOn(User, 'saving')
    const creatingMethod = vi.spyOn(User, 'creating')
    const savedMethod = vi.spyOn(User, 'saved')
    const createdMethod = vi.spyOn(User, 'created')

    useRepo(User).fresh([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ])

    expect(savingMethod).toHaveBeenCalledTimes(2)
    expect(creatingMethod).toHaveBeenCalledTimes(2)
    expect(savedMethod).toHaveBeenCalledTimes(2)
    expect(createdMethod).toHaveBeenCalledTimes(2)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
      },
    })
  })

  it('is able to change values in the saving hook', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
      @Str('') name!: string

      static saving (model: Model) {
        model.name = 'Modified'
      }
    }

    useRepo(User).fresh({ id: 1, name: 'John Doe' })

    assertState({
      users: {
        1: { id: 1, name: 'Modified' },
      },
    })
  })

  it('does not persist records for which a before hook returns false', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
      @Str('') name!: string

      static creating (model: Model) {
        return model.id !== 2
      }
    }

    const createdMethod = vi.spyOn(User, 'created')

    useRepo(User).fresh([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ])

    expect(createdMethod).toHaveBeenCalledTimes(1)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('fires no hooks when the raw option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
      @Str('') name!: string
    }

    const savingMethod = vi.spyOn(User, 'saving')
    const creatingMethod = vi.spyOn(User, 'creating')
    const savedMethod = vi.spyOn(User, 'saved')
    const createdMethod = vi.spyOn(User, 'created')

    useRepo(User).fresh([{ id: 1, name: 'John Doe' }], { raw: true })

    expect(savingMethod).not.toHaveBeenCalled()
    expect(creatingMethod).not.toHaveBeenCalled()
    expect(savedMethod).not.toHaveBeenCalled()
    expect(createdMethod).not.toHaveBeenCalled()

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })
})
