import { createORM } from 'pinia-orm'
import { ormOptions } from '#build/orm-options'

export default function (ctx: any) {
  ctx.$pinia.use(createORM(ormOptions))
}
