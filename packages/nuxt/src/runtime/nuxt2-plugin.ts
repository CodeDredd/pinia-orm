import PiniaOrm from 'pinia-orm'

export default function (ctx: any) {
  ctx.$pinia.use(PiniaOrm.install())
}
