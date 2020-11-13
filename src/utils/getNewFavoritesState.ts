import { CityInfo, Favorites } from 'interfaces';

const getNewFavoritesStore = (favorites: Favorites, city: CityInfo) => {
  const newValue = {
    [city.geonameid]: favorites[city.geonameid] ? undefined : city,
  };

  const newState = {
    ...favorites,
    ...newValue,
  };

  return [newState, newValue];
};

export default getNewFavoritesStore;
