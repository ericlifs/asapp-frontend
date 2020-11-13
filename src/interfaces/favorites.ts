import CityInfo from './cityInfo';

interface Favorites {
  [key: number]: CityInfo | undefined | Error;
}

export default Favorites;
