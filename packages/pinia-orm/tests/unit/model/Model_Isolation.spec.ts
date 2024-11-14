import { describe, expect, it } from 'vitest'
import { Model } from '../../../src'
import { Attr } from '../../../src/decorators'

describe('unit/model/ModelIsolation', () => {
  class User extends Model {
    static entity = 'users'
    @Attr() declare id: number
    @Attr() declare name: string
  }

  class Post extends Model {
    static entity = 'posts'
    @Attr() declare id: number
    @Attr() declare title: string
  }

  it('maintains separate original states for different model types with same id', () => {
    const user = new User({ id: 1, name: 'John' })
    const post = new Post({ id: 1, title: 'Hello' })

    expect(user.$getOriginal()).toEqual({ id: 1, name: 'John' })
    expect(post.$getOriginal()).toEqual({ id: 1, title: 'Hello' })
  })

  it('tracks changes independently for different model types', () => {
    const user = new User({ id: 1, name: 'John' })
    const post = new Post({ id: 1, title: 'Hello' })

    user.name = 'Jane'
    post.title = 'Updated'

    expect(user.$isDirty()).toBeTruthy()
    expect(post.$isDirty()).toBeTruthy()
    expect(user.$getOriginal()).toEqual({ id: 1, name: 'John' })
    expect(post.$getOriginal()).toEqual({ id: 1, title: 'Hello' })
  })

  it('refreshes to correct original state for each model type', () => {
    const user = new User({ id: 1, name: 'John' })
    const post = new Post({ id: 1, title: 'Hello' })

    user.name = 'Jane'
    post.title = 'Updated'

    user.$refresh()
    expect(user.name).toBe('John')
    expect(post.title).toBe('Updated')

    post.$refresh()
    expect(post.title).toBe('Hello')
  })

  it('handles multiple instances of different models with same ids', () => {
    const users = [
      new User({ id: 1, name: 'John' }),
      new User({ id: 2, name: 'Jane' })
    ]
    
    const posts = [
      new Post({ id: 1, title: 'First' }),
      new Post({ id: 2, title: 'Second' })
    ]

    users.forEach(u => u.name = `Updated ${u.name}`)
    posts.forEach(p => p.title = `Updated ${p.title}`)

    expect(users[0].$getOriginal()).toEqual({ id: 1, name: 'John' })
    expect(users[1].$getOriginal()).toEqual({ id: 2, name: 'Jane' })
    expect(posts[0].$getOriginal()).toEqual({ id: 1, title: 'First' })
    expect(posts[1].$getOriginal()).toEqual({ id: 2, title: 'Second' })
  })
})