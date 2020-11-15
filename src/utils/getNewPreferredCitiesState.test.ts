/* eslint-disable no-undef */
import getNewPreferredCitiesState from './getNewPreferredCitiesState';
import { PreferredCities } from 'interfaces';

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

describe('get new preferred cities state based on the existing state and a city', () => {
  test('add new city to empty preferred cities object', () => {
    const existingState: PreferredCities = {};

    expect(getNewPreferredCitiesState(existingState, argentina)).toStrictEqual({
      10: argentina,
    });
  });

  test('remove city from preferred cities object with that same unique city', () => {
    const existingState: PreferredCities = {
      10: argentina,
    };

    expect(getNewPreferredCitiesState(existingState, argentina)).toStrictEqual({});
  });

  test('remove city from preferred cities object with more than one city', () => {
    const existingState: PreferredCities = {
      10: argentina,
      11: brazil,
    };

    expect(getNewPreferredCitiesState(existingState, argentina)).toStrictEqual({
      11: brazil,
    });
  });
});
