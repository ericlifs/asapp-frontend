import CityInfo from './cityInfo';

interface PreferredCities {
  [key: number]: CityInfo | undefined | Error;
}

export default PreferredCities;
