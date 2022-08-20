import { Model } from '../../../../../src'
import { Attr, HasOne } from '../../../../../src/decorators'
import Phone from './circular_relations_phone'

export default class User extends Model {
  static entity = 'users'

  @Attr() id!: number

  @HasOne(() => Phone, 'userId')
    phone!: Phone | null
}
