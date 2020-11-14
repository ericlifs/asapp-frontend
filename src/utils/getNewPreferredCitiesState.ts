import { CityInfo, PreferredCities } from 'interfaces';

const getNewPreferredCitiesState = (preferredCities: PreferredCities, city: CityInfo) => {
  const newValue = {
    [city.geonameid]: preferredCities[city.geonameid] ? undefined : city,
  };

  return {
    ...preferredCities,
    ...newValue,
  };
};

export default getNewPreferredCitiesState;
