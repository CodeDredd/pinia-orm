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
    { id: 4, name: 'john', age: 20 },
    { id: 5, name: 'Zod', age: 20 },
  ]))

  it('can group records using the "groupBy" modifier', () => {
    const expected = {
      James: useRepo(User).make([
        { id: 1, name: 'James', age: 40, post: { id: 1, title: 'Title1' } },
        { id: 2, name: 'James', age: 30, post: { id: 2, title: 'Title2' } },
      ]),
      David: useRepo(User).make([
        { id: 3, name: 'David', age: 20, post: null },
      ]),
      john: useRepo(User).make([
        { id: 4, name: 'john', age: 20, post: null },
      ]),
      Zod: useRepo(User).make([
        { id: 5, name: 'Zod', age: 20, post: null },
      ]),
    }

    const expected2 = {
      '[James,40]': useRepo(User).make([
        { id: 1, name: 'James', age: 40, post: { id: 1, title: 'Title1' } },
      ]),
      '[James,30]': useRepo(User).make([
        { id: 2, name: 'James', age: 30, post: { id: 2, title: 'Title2' } },
      ]),
      '[David,20]': useRepo(User).make([
        { id: 3, name: 'David', age: 20 },
      ]),
      '[john,20]': useRepo(User).make([
        { id: 4, name: 'john', age: 20 },
      ]),
      '[Zod,20]': useRepo(User).make([
        { id: 5, name: 'Zod', age: 20 },
      ]),
    }

    expect(userCollection.groupBy('name')).toEqual(expected)
    expect(userCollection.groupBy(['name', 'age'])).toEqual(expected2)
  })

  it('can sort records using the "sortBy" modifier', () => {
    const expected = useRepo(User).make([
      { id: 3, name: 'David', age: 20, post: null },
      { id: 1, name: 'James', age: 40, post: { id: 1, title: 'Title1' } },
      { id: 2, name: 'James', age: 30, post: { id: 2, title: 'Title2' } },
      { id: 5, name: 'Zod', age: 20, post: null },
      { id: 4, name: 'john', age: 20, post: null },
    ])

    const expected2 = useRepo(User).make([
      { id: 3, name: 'David', age: 20, post: null },
      { id: 1, name: 'James', age: 40, post: { id: 1, title: 'Title1' } },
      { id: 2, name: 'James', age: 30, post: { id: 2, title: 'Title2' } },
      { id: 4, name: 'john', age: 20, post: null },
      { id: 5, name: 'Zod', age: 20, post: null },
    ])

    expect(userCollection.sortBy('name')).toEqual(expected)
    expect(userCollection.sortBy('name', 'SORT_FLAG_CASE')).toEqual(expected2)
    expect(userCollection.sortBy(model => model.name)).toEqual(expected)
    expect(userCollection.sortBy([['name', 'asc']])).toEqual(expected)
  })

  it('can sum up by field name', () => {
    expect(userCollection.sum('age')).toEqual(130)
    expect(userCollection.sum('name')).toEqual(0)
  })

  it('can min up by field name', () => {
    expect(userCollection.min('age')).toEqual(20)
    expect(userCollection.min('name')).toEqual(0)
  })

  it('can max up by field name', () => {
    expect(userCollection.max('age')).toEqual(40)
    expect(userCollection.max('name')).toEqual(0)
  })

  it('can pluck by field name', () => {
    expect(userCollection.pluck('age')).toEqual([40, 30, 20, 20, 20])
  })

  it('can return the keys of the collection', () => {
    expect(userCollection.keys()).toEqual([1, 2, 3, 4, 5])
  })

  it('can pluck by field with dot notation', () => {
    expect(userCollection.pluck('post.title')).toEqual(['Title1', 'Title2'])
  })
})
