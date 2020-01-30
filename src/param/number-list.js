const assert = require('assert');
const List = require('./list');

class NumberList extends List {
  constructor(name, position, opts = {}) {
    super(name, position, opts);
    this.items = { type: 'number' };

    assert(opts.minItemValue === undefined || Number.isInteger(opts.minItemValue));
    this.minItemValue = opts.minItemValue;

    assert(opts.maxItemValue === undefined || Number.isInteger(opts.maxItemValue));
    this.maxItemValue = opts.maxItemValue;
  }

  validate(value) {
    let valid = super.validate(value);
    let valueParsed = value;
    if (valid && this.stringInput) {
      valueParsed = JSON.parse(value);
    }
    if (valid && valueParsed.some((e) => typeof e !== 'number')) {
      valid = false;
    }
    if (valid && this.minItemValue !== undefined && valueParsed.some((e) => e < this.minItemValue)) {
      valid = false;
    }
    if (valid && this.maxItemValue !== undefined && valueParsed.some((e) => e > this.maxItemValue)) {
      valid = false;
    }
    return valid;
  }
}
module.exports = NumberList;
