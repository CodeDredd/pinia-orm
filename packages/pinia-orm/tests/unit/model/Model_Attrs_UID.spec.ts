import { describe, expect, it } from 'vitest'

import { Model } from '../../../src'
import { mockUid } from '../../helpers'
import { Attr, Cast } from '../../../src/decorators'
import { NanoIdNS } from '../../../src/model/decorators/single/NanoIdNS'
import { NanoIdNonSecureCast } from '../../../src/model/casts/single/NanoIdNonSecureCast'

describe('unit/model/Model_Attrs_UID', () => {
  it('creates uid with nano by custom decorator', () => {
    class User extends Model {
      static entity = 'users'

      @NanoIdNS()
        id!: string
    }

    mockUid(['uid1'])

    expect(new User().id).toBe('uid1')
  })

  it('creates uid with nano by cast decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Cast(() => NanoIdNonSecureCast)
      @Attr('')
        id!: string
    }

    mockUid(['uid2'])

    expect(new User().id).toBe('uid2')
  })

  it('creates uid without decorator', () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(''),
        }
      }

      static casts() {
        return {
          id: NanoIdNonSecureCast,
        }
      }

      declare id: string
    }

    mockUid(['uid2'])

    expect(new User().id).toBe('uid2')
  })
})
