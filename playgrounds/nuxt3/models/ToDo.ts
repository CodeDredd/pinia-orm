import { Model } from 'pinia-orm'
import { Str } from 'pinia-orm/decorators'
import { Uid } from 'pinia-orm/packages/nanoid/non-secure'

export default class ToDo extends Model {
  static entity = 'todos'

  static fields() {
    return {
      id: this.uid(),
      title: this.string(''),
      user_id: this.attr(null).nullable(),
    }
  }

  @Uid() declare id: string
  @Str('Todo Text') declare text: string
  @Str('Todo Name') declare  name: string

}
