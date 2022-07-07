import { Model } from 'pinia-orm'
import ToDo from '~/models/ToDo'

export default class User extends Model {
  static entity = 'users'

  static fields() {
    return {
      id: this.uid(),
      name: this.string(''),
      first_name: this.string('').nullable(),
      last_name: this.string('').nullable(),
      todos: this.hasMany(ToDo, 'user_id')
    }
  }

  id!: number
  first_name!: string | null
  last_name!: string | null
  name!: string
}
