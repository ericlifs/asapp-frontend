import CityInfo from './cityInfo';

interface Favorites {
  [key: number]: CityInfo | undefined;
}

export default Favorites;
