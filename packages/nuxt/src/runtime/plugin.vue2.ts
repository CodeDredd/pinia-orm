import { createORM } from 'pinia-orm'
import { ormOptions } from '#build/orm-options'

export default function (ctx: any) {
  // eslint-disable-next-line import/no-named-as-default-member
  ctx.$pinia.use(createORM(ormOptions))
}
