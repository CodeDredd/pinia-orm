import { beforeEach, describe, expect, it } from 'vitest'

import { Attr, Cast, CastAttribute, Model } from '../../../src'

describe('unit/model/Model_Casts_Custom', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('should cast', () => {
    class CustomCast extends CastAttribute {
      get(value?: any): any {
        return typeof value === 'string' ? `string ${value}` : value
      }

      set(value?: any): any {
        return this.get(value)
      }
    }

    class User extends Model {
      static entity = 'users'

      @Attr('{}') name!: string

      static casts() {
        return {
          name: CustomCast,
        }
      }
    }

    expect(new User({ name: 'John' }).name).toBe('string John')
  })

  it('should cast with decorator', () => {
    class CustomCast extends CastAttribute {
      get(value?: any): any {
        return typeof value === 'string' ? `string ${value}` : value
      }

      set(value?: any): any {
        return this.get(value)
      }
    }

    class User extends Model {
      static entity = 'users'

      @Cast(() => CustomCast)
      @Attr('test') name!: string
    }

    expect(new User({ name: 'John' }).name).toBe('string John')
    expect(new User().name).toBe('test')
  })

  it('should cast with parameter', () => {
    class CustomCast extends CastAttribute {
      static parameters = {
        type: 'string',
      }

      get(value?: any): any {
        const type = this.getParameters().type
        return typeof value === type ? `${type} ${value}` : value
      }

      set(value?: any): any {
        return this.get(value)
      }
    }

    class User extends Model {
      static entity = 'users'

      @Attr('{}') name!: string

      static casts() {
        return {
          name: CustomCast.withParameters({ type: 'number' }),
        }
      }
    }

    expect(new User({ name: 'John' }).name).toBe('John')
    expect(new User({ name: 1 }).name).toBe('number 1')
  })
})
