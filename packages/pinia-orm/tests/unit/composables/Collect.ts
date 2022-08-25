import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasOne, Num, Str } from '../../../src/decorators'
import { useCollect } from '../../../src/composables/collection/useCollect'

describe('unit/composables/Collect', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() declare id: number
    @Str('') declare name: string
    @Num(0) declare age: number

    @HasOne(() => Post, 'userId') declare post: Post
  }

  class Post extends Model {
    static entity = 'posts'

    @Num(0) declare id: number
    @Num(0) declare userId: number
    @Str('') declare title: string
  }

  const userCollection = useCollect(useRepo(User).make([
    { id: 1, name: 'James', age: 40, post: { id: 1, title: 'Title1' } },
    { id: 2, name: 'James', age: 30, post: { id: 2, title: 'Title2' } },
    { id: 3, name: 'David', age: 20 },
  ]))

  it('can group records using the "groupBy" modifier', () => {
    const expected = {
      James: [
        { id: 1, name: 'James', age: 40 },
        { id: 2, name: 'James', age: 30 },
      ],
      David: [
        { id: 3, name: 'David', age: 20 },
      ],
    }

    expect(userCollection.groupBy('name')).toEqual(expected)
  })

  it('can sum up by field name', () => {
    expect(userCollection.sum('age')).toEqual(90)
  })

  it('can min up by field name', () => {
    expect(userCollection.min('age')).toEqual(20)
  })

  it('can max up by field name', () => {
    expect(userCollection.max('age')).toEqual(40)
  })

  it('can pluck by field name', () => {
    expect(userCollection.pluck('age')).toEqual([40, 30, 20])
  })

  it('can return the keys of the collection', () => {
    expect(userCollection.keys()).toEqual([1, 2, 3])
  })

  it('can pluck by field with dot notation', () => {
    expect(userCollection.pluck('post.title')).toEqual(['Title1', 'Title2'])
  })
})
