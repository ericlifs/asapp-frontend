/* eslint-disable no-undef */
import getNewFavoritesState from './getNewFavoritesState';
import { Favorites } from 'interfaces';

const argentina = {
  geonameid: 10,
  name: 'Argentina',
  country: 'Argentina',
};

const brazil = {
  geonameid: 11,
  name: 'Brazil',
  country: 'Brazil',
};

describe('get new favorites state based on the existing state and a city', () => {
  test('add new city to empty favorites object', () => {
    const existingState: Favorites = {};

    expect(getNewFavoritesState(existingState, argentina)).toStrictEqual({
      10: argentina,
    });
  });

  test('remove city from favorites object with that same unique city', () => {
    const existingState: Favorites = {
      10: argentina,
    };

    expect(getNewFavoritesState(existingState, argentina)).toStrictEqual({
      10: undefined,
    });
  });

  test('remove city from favorites object with more than one city', () => {
    const existingState: Favorites = {
      10: argentina,
      11: brazil,
    };

    expect(getNewFavoritesState(existingState, argentina)).toStrictEqual({
      10: undefined,
      11: brazil,
    });
  });
});
