/* eslint-disable no-unused-vars */
import { CityInfo, PreferredCities } from 'interfaces';
import omit from 'lodash.omit';

const getNewPreferredCitiesState = (preferredCities: PreferredCities, city: CityInfo): PreferredCities => {
  if (preferredCities[city.geonameid]) {
    return omit(preferredCities, [city.geonameid]);
  }

  return {
    ...preferredCities,
    [city.geonameid.toString()]: city,
  };
};

export default getNewPreferredCitiesState;
