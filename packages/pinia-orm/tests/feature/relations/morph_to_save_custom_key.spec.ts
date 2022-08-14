import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphTo, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/morph_to_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph to" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @Num(0) userId!: number
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

    const imagesRepo = useRepo(Image)

    imagesRepo.save({
      id: 1,
      url: '/profile.jpg',
      imageableType: 'users',
      imageable: { userId: 2, name: 'John Doe' },
    })

    assertState({
      users: { 2: { userId: 2, name: 'John Doe' } },
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

  it('inserts "morph to" relation with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Attr() imageableId!: number
      @Str('') name!: string
    }

    class Image extends Model {
      static entity = 'images'

      @Num(0) id!: number
      @Str('') url!: string
      @Attr() imageableId!: number
      @Attr() imageableType!: string
      @MorphTo(() => [User], 'imageableId', 'imageableType', 'imageableId')
        imageable!: User | null
    }

    const imagesRepo = useRepo(Image)

    imagesRepo.save({
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 1, imageableId: 2, name: 'John Doe' },
    })

    assertState({
      users: { 1: { id: 1, imageableId: 2, name: 'John Doe' } },
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
})
