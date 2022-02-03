import { Model } from 'pinia-orm'

export default class ToDo extends Model {
  static entity = 'todos'

  static fields() {
    return {
      id: this.uid(),
      title: this.string(''),
      user_id: this.attr(null).nullable(),
    }
  }

  id!: number
  title!: string
}
