/* eslint-disable no-undef */
import { QueryParams } from 'interfaces';
import stringifyParams from './strinfigyParams';

describe('stringify params in order to use it as part of api params', () => {
  test('stringify empty object', () => {
    const params: QueryParams = {};

    expect(stringifyParams(params)).toBe('');
  });

  test('stringify one param', () => {
    const params: QueryParams = { filter: 'Braz' };

    expect(stringifyParams(params)).toBe('?filter=Braz');
  });

  test('stringify more than one param', () => {
    const params: QueryParams = { filter: 'Braz', offset: 20 };

    expect(stringifyParams(params)).toBe('?filter=Braz&offset=20');
  });
});
