import { describe, expect, it } from 'vitest'
import { computed } from 'vue-demi'

import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { fillState } from '../../helpers'

describe('feature/reactivity/reactivity', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('check save reactivity', () => {
    const userRepo = useRepo(User)

    const allUsers = computed(() => userRepo.all())

    expect(allUsers.value).toEqual([])

    userRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    expect(allUsers.value).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])
  })

  it('check insert reactivity', () => {
    const userRepo = useRepo(User)

    const allUsers = computed(() => userRepo.all())

    expect(allUsers.value).toEqual([])

    userRepo.insert({ id: 1, name: 'John Doe' })

    expect(allUsers.value).toEqual([
      { id: 1, name: 'John Doe' },
    ])
  })

  it('check update reactivity', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const allUsers = computed(() => userRepo.all())

    expect(allUsers.value).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    userRepo.where('name', 'Jane Doe').update({ name: 'Jane Doe Updated' })

    expect(allUsers.value).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe Updated' },
      { id: 3, name: 'Johnny Doe' },
    ])
  })

  it('check destroy reactivity', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const allUsers = computed(() => userRepo.all())

    expect(allUsers.value).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    userRepo.destroy([2, 3])

    expect(allUsers.value).toEqual([
      { id: 1, name: 'John Doe' },
    ])
  })

  it('check delete reactivity', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const allUsers = computed(() => userRepo.all())

    expect(allUsers.value).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    userRepo.where('name', 'Jane Doe').orWhere('name', 'Johnny Doe').delete()

    expect(allUsers.value).toEqual([
      { id: 1, name: 'John Doe' },
    ])
  })
})
