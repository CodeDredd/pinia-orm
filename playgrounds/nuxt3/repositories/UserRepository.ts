import { Repository } from "pinia-orm"
import User from "~/models/User"

export class UserRepository extends Repository<User> {
      use = User

      custom (): number {
        return 1
      }
    }
