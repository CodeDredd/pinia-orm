import { Model } from 'pinia-orm'
import { Str, Attr } from 'pinia-orm/dist/decorators'
import { Uid } from 'pinia-orm/dist/uuid/v4'

export default class ToDo extends Model {
  static entity = 'todos'

  @Uid() declare id: string
  @Attr(null) declare user_id: string | number
  @Str('Todo Text') declare title: string
  @Str('Todo Name') declare  name: string

}
