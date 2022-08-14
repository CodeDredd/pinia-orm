import { describe, expect, it } from 'vitest'

import { Model, Repository, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'

describe('feature/repository_custom/custom_repository', () => {
  it('can define a custom repository', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
      @Str('') name!: string
    }

    class UserRepository extends Repository<User> {
      use = User

      custom(): number {
        return 1
      }
    }

    const userRepo = useRepo(UserRepository)

    expect(userRepo.custom()).toBe(1)
  })

  it('can define an abstract custom repository', () => {
    class ARepository extends Repository {
      custom(): number {
        return 1
      }
    }

    const userRepo = useRepo(ARepository)

    expect(userRepo.custom()).toBe(1)
  })

  it('throws if the user tries to access the model in abstract custom repository', () => {
    class ARepository extends Repository {
      custom(): any {
        this.getModel()
      }
    }

    const userRepo = useRepo(ARepository)

    expect(() => {
      userRepo.custom()
    }).toThrow()
  })
})
