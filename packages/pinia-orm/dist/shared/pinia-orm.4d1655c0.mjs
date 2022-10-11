class CastAttribute {
  constructor(attributes) {
    this.$self().attributes = attributes;
  }
  get(value) {
    return value;
  }
  set(value) {
    return value;
  }
  static withParameters(parameters) {
    this.parameters = parameters;
    return this;
  }
  getParameters() {
    return this.$self().parameters;
  }
  $self() {
    return this.constructor;
  }
  static newRawInstance(attributes) {
    return new this(attributes);
  }
}

export { CastAttribute as C };
