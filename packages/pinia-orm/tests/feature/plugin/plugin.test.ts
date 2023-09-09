import { describe, expect, it } from 'vitest'
import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { createPiniaORM } from '../../helpers'
import { PiniaOrmPlugin } from '../../../src'

describe('feature/plugin/plugin', () => {
  class User extends Model {
    static entity = 'users'

    @Attr(0) declare id: number
    @Str('') declare name: string
    @Str('') declare username: string
  }

  it('can add extra config to the configuration', () => {
    const plugin: PiniaOrmPlugin = (context) => {
      context.config.apiConfig = 'test'
      return context
    }

    createPiniaORM(undefined, [plugin])

    const userRepo = useRepo(User)

    expect(userRepo.config.apiConfig).toBe('test')
  })
})
