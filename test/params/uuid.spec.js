const expect = require('chai').expect;
const api = require('../../src/api').Api();

describe('Testing UUID Parameter', () => {
  const queryParam = api.UUID('value');

  it('Testing valid query parameter', () => {
    expect(queryParam.get({
      queryStringParameters: {
        value: '9d09d573-173e-4919-b823-70d406242040'
      }
    })).to.equal('9d09d573-173e-4919-b823-70d406242040');
  });

  it('Testing invalid query parameter', () => {
    expect(() => queryParam.get({
      queryStringParameters: {
        value: 'invalid'
      }
    })).to.throw('Invalid Value for query-Parameter "value" provided.');
  });
});
