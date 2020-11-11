/* eslint-disable no-unused-vars */
import { action, makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { CityInfo, Favorites } from '../interfaces';

class PreferencesStore {
  constructor() {
    makeAutoObservable(this);
  }

  public favorites: Favorites = {};

  /**
   * Adds or removes city from favorites lists
   * @param {CityInfo} city - City info object which will be added/removed from favorites list
   */
  @action
  public toggleFavorite(city: CityInfo) {
    const newValue = this.favorites[city.geonameid] ? undefined : city;

    this.favorites = {
      ...this.favorites,
      [city.geonameid]: newValue,
    };
  }
}

export default createContext(new PreferencesStore());
