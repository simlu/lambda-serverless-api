const assert = require('assert');
const get = require('lodash.get');
const response = require('../response');

const positionMapping = {
  query: 'queryStringParameters',
  json: 'body',
  path: 'pathParameters',
  header: 'headers',
  context: 'requestContext'
};

class Abstract {
  constructor(name, position, {
    required = true,
    nullable = false,
    normalize = true,
    getter = null
  } = {}) {
    assert(Object.keys(positionMapping).includes(position), `Unknown Parameter Position: ${position}`);
    assert(
      nullable === false || ['json', 'context'].includes(position),
      `Parameter Position cannot be nullable: ${position}`
    );
    this.nameOriginal = name;
    this.name = name.endsWith('+') ? name.slice(0, name.length - 1) : name;
    this.position = position;
    this.stringInput = !['json', 'context'].includes(position);
    this.required = required;
    this.nullable = nullable;
    this.normalize = normalize;
    this.getter = getter;
    this.type = null;
  }

  validate(value) {
    return !(this.stringInput && typeof value !== 'string');
  }

  get(event) {
    const result = get(event, `${positionMapping[this.position]}.${
      this.position === 'header'
        ? this.name.toLowerCase()
        : this.name
    }`);
    if (result === undefined) {
      if (this.required) {
        throw response.ApiError(`Required ${this.position}-Parameter "${this.name}" missing.`, 400, 99002);
      }
    } else if (result === null) {
      if (this.nullable !== true) {
        throw response.ApiError(`Non-nullable ${this.position}-Parameter "${this.name}" is null.`, 400, 99006);
      }
    } else if (!this.validate(result)) {
      throw response.ApiError(`Invalid Value for ${this.position}-Parameter "${this.name}" provided.`, 400, 99003, {
        value: result
      });
    }
    const r = this.getter !== null && ![undefined, null].includes(result)
      ? (params) => this.getter(result, params)
      : result;
    if (typeof r !== 'string' || this.normalize === false) {
      return r;
    }
    return r
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x09\x0B\x1F\x7F-\x9F]/g, ' ')
      .replace(/(?<=\s) /g, '')
      .replace(/ (?=\s)/g, '')
      .replace(/\s+$|^\s+/g, '');
  }
}

module.exports = Abstract;
