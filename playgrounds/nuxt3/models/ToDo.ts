import { Model } from 'pinia-orm'
import { Attr, Str } from 'pinia-orm/dist/decorators'
import { Uid } from 'pinia-orm/dist/uuid/v4'

export default class ToDo extends Model {
  static entity = 'todos'

  @Uid() id!: string
  @Attr(null) user_id!: string | number
  @Str('Todo Text') title!: string
  @Str('Todo Name') name!: string
}
