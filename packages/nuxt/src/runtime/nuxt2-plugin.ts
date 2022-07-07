import PiniaOrm from 'pinia-orm'

export default function (ctx: any) {
  // eslint-disable-next-line import/no-named-as-default-member
  ctx.$pinia.use(PiniaOrm.install())
}
