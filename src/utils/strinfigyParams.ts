import { QueryParams } from 'interfaces';

/**
 * Generates a new query parameters string ready to be used on an api request.
 * @param {QueryParams} params - An object which each <key, param> represents the param name and value
 */
const stringifyParams = (params: QueryParams): string => {
  const mappedParams = Object.entries(params)
    .map(([key, value], index) => `${index === 0 ? '?' : '&'}${key}=${value}`)
    .join('');

  return mappedParams;
};

export default stringifyParams;
