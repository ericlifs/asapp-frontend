import { CityInfo, Favorites } from 'interfaces';

const getNewFavoritesStore = (favorites: Favorites, city: CityInfo): Favorites => {
  const newValue = favorites[city.geonameid] ? undefined : city;

  return {
    ...favorites,
    [city.geonameid]: newValue,
  };
};

export default getNewFavoritesStore;
