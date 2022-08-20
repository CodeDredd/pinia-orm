import { Model } from 'pinia-orm'

export default class Todo extends Model {
  static entity = 'Todo'

  static fields () {
    return {
      id: this.uid(),
      text: this.string(''),
      name: this.string('')
    }
  }

  id!: string
  text!: number
  name!: number
}
