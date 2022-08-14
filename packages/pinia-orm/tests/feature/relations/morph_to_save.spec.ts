import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphTo, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/morph_to_save', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string
  }

  class Image extends Model {
    static entity = 'images'

    @Num(0) id!: number
    @Str('') url!: string
    @Attr() imageableId!: number
    @Attr() imageableType!: string
    @MorphTo(() => [User], 'imageableId', 'imageableType')
      imageable!: User | null
  }

  it('inserts a record to the store with "morph to" relation', () => {
    const imagesRepo = useRepo(Image)

    imagesRepo.save({
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 2, name: 'John Doe' },
    })

    assertState({
      users: { 2: { id: 2, name: 'John Doe' } },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 2,
          imageableType: 'users',
        },
      },
    })
  })

  it('generates missing relational key', () => {
    const imagesRepo = useRepo(Image)

    imagesRepo.save({
      id: 1,
      url: '/profile.jpg',
      imageableType: 'users',
      imageable: { id: 2, name: 'John Doe' },
    })

    assertState({
      users: { 2: { id: 2, name: 'John Doe' } },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 2,
          imageableType: 'users',
        },
      },
    })
  })

  it('can insert a record with missing related data', () => {
    const imagesRepo = useRepo(Image)

    imagesRepo.save({
      id: 1,
      url: '/profile.jpg',
    })

    assertState({
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: null,
          imageableType: null,
        },
      },
    })
  })

  it('can insert a record with related data set to `null`', () => {
    const imagesRepo = useRepo(Image)

    imagesRepo.save({
      id: 1,
      url: '/profile.jpg',
      imageable: null,
    })

    assertState({
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: null,
          imageableType: null,
        },
      },
    })
  })
})
