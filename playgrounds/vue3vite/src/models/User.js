import { Model } from 'pinia-orm'

export default class User extends Model {
  static entity = 'users'

  static fields() {
    return {
      id: this.attr(null),
      name: this.attr(''),
      email: this.attr(''),
    }
  }

  static config = {
    axiosApi: {
      actions: {
        fetchById(id) {
          return this.get(`/api/users/${id}`)
        },
      },
    },
  }
}
