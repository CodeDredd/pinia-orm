'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const async = require('nanoid/async');
const CastAttribute = require('../shared/pinia-orm.316cf413.cjs');

class UidCast extends CastAttribute.CastAttribute {
  constructor(attributes) {
    super(attributes);
  }
  async set(value) {
    return value ?? await async.nanoid();
  }
}

function Uid() {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setCast(propertyKey, UidCast);
    self.setRegistry(propertyKey, () => self.uid());
  };
}

exports.Uid = Uid;
exports.UidCast = UidCast;
