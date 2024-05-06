import { describe, expect, it, vi } from 'vitest'

import { Model, Repository, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModel, assertModels } from '../../helpers'

/* eslint-disable no-console */
describe('unit/repository/Repository', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('John Doe') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: any
    @Str('Title 001') title!: string
  }

  it('creates a new model instance', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make()

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: null, name: 'John Doe' })
  })

  it('creates a new model instance with default values', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      name: 'Jane Doe',
    })

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: 1, name: 'Jane Doe' })
  })

  it('creates many new model instances with default values', () => {
    const userRepo = useRepo(User)

    const users = userRepo.make([
      {
        id: 1,
        name: 'Jane Doe',
      },
      {
        id: 2,
        name: 'John Doe',
      },
    ])

    assertInstanceOf(users, User)
    assertModels(users, [
      {
        id: 1,
        name: 'Jane Doe',
      },
      {
        id: 2,
        name: 'John Doe',
      },
    ])
  })

  it('can create a new repository from the model', () => {
    const userRepo = useRepo(User)

    const postRepo = userRepo.repo(Post)

    expect(postRepo.getModel()).toBeInstanceOf(Post)
  })

  it('can create a new repository from the custom repository', () => {
    class PostRepository extends Repository<Post> {
      use = Post
    }

    const userRepo = useRepo(User)

    const postRepo = userRepo.repo(PostRepository)

    expect(postRepo.getModel()).toBeInstanceOf(Post)
  })

  it('can create a new repository from the custom repository without use defined', () => {
    class PostRepository extends Repository<Post> {
    }

    const userRepo = useRepo(User)

    const postRepo = userRepo.repo(PostRepository.setModel(Post))

    const symbol = Symbol('test')

    expect(userRepo[symbol]).toBe(undefined)

    expect(postRepo.getModel()).toBeInstanceOf(Post)
  })

  it('can trigger cache & hook from the pinia store action', () => {
    const userRepo = useRepo(User)
    expect(userRepo.hydratedDataCache.size).toBe(0)

    userRepo.piniaStore().save({ 1: { id: 1, name: 'John' } })
    expect(userRepo.hydratedDataCache.size).toBe(1)

    userRepo.piniaStore().update({ 1: { id: 1, name: 'John 2' } })
    expect(userRepo.hydratedDataCache.size).toBe(0)

    userRepo.piniaStore().insert({ 2: { id: 2, name: 'John 3' } })
    userRepo.piniaStore().insert({ 3: { id: 3, name: 'John 4' } })
    expect(userRepo.all().length).toBe(3)
    expect(userRepo.hydratedDataCache.size).toBe(3)

    userRepo.piniaStore().delete([2])
    expect(userRepo.all().length).toBe(2)
    expect(userRepo.hydratedDataCache.size).toBe(2)

    userRepo.piniaStore().destroy([1])
    expect(userRepo.all().length).toBe(1)
    expect(userRepo.hydratedDataCache.size).toBe(1)

    userRepo.piniaStore().fresh({ 1: { id: 1, name: 'John' }, 2: { id: 2, name: 'John 2' } })
    expect(userRepo.hydratedDataCache.size).toBe(2)

    userRepo.piniaStore().flush()
    expect(userRepo.hydratedDataCache.size).toBe(0)
  })

  it('can access the pinia store', () => {
    const logger = vi.spyOn(console, 'log')

    const userRepo = useRepo(User)
    userRepo.piniaStore().$onAction(({
      name, // name of the action
      // store, // store instance, same as `someStore`
      args, // array of parameters passed to the action
      after, // hook after the action returns or resolves
      onError, // hook if the action throws or rejects
    }) => {
      // a shared variable for this specific action call
      const startTime = Date.now()
      // this will trigger before an action on `store` is executed
      console.log(`Start "${name}" with params [${args.join(', ')}].`)

      // this will trigger if the action succeeds and after it has fully run.
      // it waits for any returned promised
      after((result) => {
        console.log(
          `Finished "${name}" after ${
            Date.now() - startTime
          }ms.\nResult: ${result}.`,
        )
      })

      // this will trigger if the action throws or returns a promise that rejects
      onError((error) => {
        console.warn(
          `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`,
        )
      })
    })

    userRepo.save({ id: 1, name: 'John Doe' })

    expect(logger).toBeCalled()
  })
})
