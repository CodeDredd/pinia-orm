import { nanoid } from 'nanoid/async';
import { C as CastAttribute } from '../shared/pinia-orm.4d1655c0.mjs';

class UidCast extends CastAttribute {
  constructor(attributes) {
    super(attributes);
  }
  async set(value) {
    return value ?? await nanoid();
  }
}

function Uid() {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setCast(propertyKey, UidCast);
    self.setRegistry(propertyKey, () => self.uid());
  };
}

export { Uid, UidCast };
