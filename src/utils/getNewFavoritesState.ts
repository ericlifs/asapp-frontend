import { CityInfo, Favorites } from 'interfaces';

const getNewFavoritesState = (favorites: Favorites, city: CityInfo) => {
  const newValue = {
    [city.geonameid]: favorites[city.geonameid] ? undefined : city,
  };

  return {
    ...favorites,
    ...newValue,
  };
};

export default getNewFavoritesState;
