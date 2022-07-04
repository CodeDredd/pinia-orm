import { Model, Attr, BelongsTo } from '../../../../../src'
import User from './circular_relations_user'

export default class Phone extends Model {
  static entity = 'phones'

  @Attr() id!: number
  @Attr() userId!: number | null

  @BelongsTo(() => User, 'userId')
  author!: User | null
}
