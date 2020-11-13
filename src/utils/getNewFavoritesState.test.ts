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
    const newValue = { 10: argentina };

    expect(getNewFavoritesState(existingState, argentina)).toStrictEqual([newValue, newValue]);
  });

  test('remove city from favorites object with that same unique city', () => {
    const existingState: Favorites = {
      10: argentina,
    };

    const newValue = { 10: undefined };

    expect(getNewFavoritesState(existingState, argentina)).toStrictEqual([newValue, newValue]);
  });

  test('remove city from favorites object with more than one city', () => {
    const existingState: Favorites = {
      10: argentina,
      11: brazil,
    };

    const newValue = { 10: undefined };
    const newState = [{ ...newValue, 11: brazil }, newValue];

    expect(getNewFavoritesState(existingState, argentina)).toStrictEqual(newState);
  });
});
